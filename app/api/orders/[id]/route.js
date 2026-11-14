import { NextResponse } from "next/server";
import { updateOrderStatus, deleteOrder } from "@/lib/dataService";

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    if (!body.status) {
      return NextResponse.json(
        { success: false, error: "Status is required." },
        { status: 400 }
      );
    }
    const updated = await updateOrderStatus(params.id, body.status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await deleteOrder(params.id);
    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
