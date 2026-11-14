import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/dataService";

export async function GET(request, { params }) {
  try {
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const updated = await updateProduct(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Product not found or update failed" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await deleteProduct(params.id);
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
