import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

  let tempFilePath: string | null = null;

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

    // Validate it's an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convert captured image to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temp directory if needed
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save captured image temporarily
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    tempFilePath = path.join(
      uploadsDir,
      `capture_${timestamp}_${randomId}.jpg`
    );
    fs.writeFileSync(tempFilePath, buffer);

    // Send to Plate Recognizer API
    const plateRecognizerFormData = new FormData();
    const fileBuffer = fs.readFileSync(tempFilePath);
    const blob = new Blob([fileBuffer], { type: "image/jpeg" });
    plateRecognizerFormData.append("upload", blob, "capture.jpg");

    const apiResponse = await fetch(
      "https://api.platerecognizer.com/v1/plate-reader/",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
        },
        body: plateRecognizerFormData,
      }
    );

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

    // Clean up temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    return NextResponse.json(
      {
        plateText,
        confidence,
        processingTime: apiData.processing_time || 0,
        success: plateText !== "Not Detected",
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Plate recognition error:", error);

    // Clean up temporary file on error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error("Failed to cleanup temp file:", cleanupError);
      }
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
      { status: 500, headers: corsHeaders }
    );
  }
}
