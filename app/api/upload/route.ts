import { NextRequest, NextResponse } from "next/server";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  // Check for API key
  const apiKey = process.env.PLATE_RECOGNIZER_API_KEY;
  if (!apiKey) {
    console.error("PLATE_RECOGNIZER_API_KEY not configured");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    // Parse form data from camera capture
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // Validate captured image
    if (!file) {
      return NextResponse.json(
        { error: "No image captured" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convert captured image to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create blob directly from buffer (no file system operations)
    const blob = new Blob([buffer], { type: file.type || "image/jpeg" });

    // Send to Plate Recognizer API with timeout
    const plateRecognizerFormData = new FormData();
    plateRecognizerFormData.append("upload", blob, "capture.jpg");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const apiResponse = await fetch(
      "https://api.platerecognizer.com/v1/plate-reader/",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
        },
        body: plateRecognizerFormData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    // Handle API response
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(
        `Plate Recognizer API error: ${apiResponse.status} - ${errorText}`
      );

      if (apiResponse.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again in a moment." },
          { status: 429, headers: corsHeaders }
        );
      }

      if (apiResponse.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key. Please check configuration." },
          { status: 401, headers: corsHeaders }
        );
      }

      throw new Error(`Plate Recognizer API failed: ${apiResponse.status}`);
    }

    const apiData = await apiResponse.json();

    // Extract plate number from response
    let plateText = "Not Detected";
    let confidence = 0;

    if (apiData.results && apiData.results.length > 0) {
      const result = apiData.results[0];
      if (result.plate && result.plate.trim()) {
        plateText = result.plate.trim();
        confidence = result.confidence || 0;
      }
    }

    return NextResponse.json(
      {
        plateText,
        confidence,
        processingTime: apiData.processing_time || 0,
        success: plateText !== "Not Detected",
      },
      {
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Plate recognition error:", error);

    // Handle timeout errors
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        {
          error: "Request timed out. Please try again.",
          details: "Plate recognition service is taking too long to respond.",
          success: false,
        },
        { status: 408, headers: corsHeaders }
      );
    }

    // Return appropriate error response
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Plate recognition failed",
        details: errorMessage,
        success: false,
      },
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
