import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "./supabase";

const PRODUCTS_FILE = path.join(process.cwd(), "data", "products.json");
const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

// Helper to read local JSON
function readLocalJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

// Helper to write local JSON
function writeLocalJson(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// ==========================================
// PRODUCTS SERVICE
// ==========================================

export async function getAllProducts() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        category: item.category,
        price: Number(item.price),
        oldPrice: item.old_price ? Number(item.old_price) : null,
        stock: item.stock || "in",
        size: item.size || "",
        material: item.material || "",
        description: item.description || "",
        features: Array.isArray(item.features) ? item.features : [],
        care: Array.isArray(item.care) ? item.care : [],
        image: item.image || "/images/cat-artificial.webp",
        badge: item.badge || null,
        featured: Boolean(item.featured),
        createdAt: item.created_at,
      }));
    }
  }
  return readLocalJson(PRODUCTS_FILE);
}

export async function getProductById(id) {
  const products = await getAllProducts();
  return products.find((p) => p.id === id || p.slug === id) || null;
}

export async function createProduct(payload) {
  const newProduct = {
    id: "prod-" + Date.now(),
    slug:
      payload.slug ||
      payload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
    name: payload.name.trim(),
    category: payload.category || "artificial-plants",
    price: Number(payload.price) || 0,
    oldPrice: payload.oldPrice ? Number(payload.oldPrice) : null,
    stock: payload.stock || "in",
    size: payload.size || "",
    material: payload.material || "",
    description: payload.description || "",
    features: Array.isArray(payload.features) ? payload.features : [],
    care: Array.isArray(payload.care) ? payload.care : [],
    image: payload.image || "/images/cat-artificial.webp",
    badge: payload.badge || null,
    featured: Boolean(payload.featured),
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("products")
      .insert({
        slug: newProduct.slug,
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        old_price: newProduct.oldPrice,
        stock: newProduct.stock,
        size: newProduct.size,
        material: newProduct.material,
        description: newProduct.description,
        features: newProduct.features,
        care: newProduct.care,
        image: newProduct.image,
        badge: newProduct.badge,
        featured: newProduct.featured,
      })
      .select()
      .single();

    if (!error && data) {
      newProduct.id = data.id;
    }
  }

  // Always keep local JSON in sync
  const current = readLocalJson(PRODUCTS_FILE);
  current.unshift(newProduct);
  writeLocalJson(PRODUCTS_FILE, current);

  return newProduct;
}

export async function updateProduct(id, updates) {
  if (isSupabaseConfigured && supabase) {
    const payload = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.slug !== undefined) payload.slug = updates.slug;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.price !== undefined) payload.price = Number(updates.price);
    if (updates.oldPrice !== undefined)
      payload.old_price = updates.oldPrice ? Number(updates.oldPrice) : null;
    if (updates.stock !== undefined) payload.stock = updates.stock;
    if (updates.size !== undefined) payload.size = updates.size;
    if (updates.material !== undefined) payload.material = updates.material;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.features !== undefined) payload.features = updates.features;
    if (updates.care !== undefined) payload.care = updates.care;
    if (updates.image !== undefined) payload.image = updates.image;
    if (updates.badge !== undefined) payload.badge = updates.badge;
    if (updates.featured !== undefined) payload.featured = Boolean(updates.featured);
    payload.updated_at = new Date().toISOString();

    await supabase.from("products").update(payload).eq("id", id);
  }

  const current = readLocalJson(PRODUCTS_FILE);
  const index = current.findIndex((p) => p.id === id || p.slug === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...updates, updatedAt: new Date().toISOString() };
    writeLocalJson(PRODUCTS_FILE, current);
    return current[index];
  }
  return null;
}

export async function deleteProduct(id) {
  if (isSupabaseConfigured && supabase) {
    await supabase.from("products").delete().eq("id", id);
  }

  const current = readLocalJson(PRODUCTS_FILE);
  const filtered = current.filter((p) => p.id !== id && p.slug !== id);
  writeLocalJson(PRODUCTS_FILE, filtered);
  return true;
}

// ==========================================
// ORDERS SERVICE
// ==========================================

export async function getAllOrders() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data.map((item) => ({
        id: item.id,
        orderNumber: item.order_number,
        customerName: item.customer_name,
        customerPhone: item.customer_phone,
        customerAddress: item.customer_address,
        customerCity: item.customer_city,
        items: item.items || [],
        totalAmount: Number(item.total_amount),
        paymentMethod: item.payment_method,
        status: item.status,
        notes: item.notes || "",
        createdAt: item.created_at,
      }));
    }
  }
  return readLocalJson(ORDERS_FILE);
}

export async function createOrder(payload) {
  const currentOrders = readLocalJson(ORDERS_FILE);
  const orderNumber = "LN-" + (1000 + currentOrders.length + 1);

  const newOrder = {
    id: "ord-" + Date.now(),
    orderNumber,
    customerName: payload.customerName || "Customer",
    customerPhone: payload.customerPhone || "",
    customerAddress: payload.customerAddress || "",
    customerCity: payload.customerCity || "",
    items: payload.items || [],
    totalAmount: Number(payload.totalAmount) || 0,
    paymentMethod: payload.paymentMethod || "WhatsApp Order",
    status: "pending",
    notes: payload.notes || "",
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: newOrder.orderNumber,
        customer_name: newOrder.customerName,
        customer_phone: newOrder.customerPhone,
        customer_address: newOrder.customerAddress,
        customer_city: newOrder.customerCity,
        items: newOrder.items,
        total_amount: newOrder.totalAmount,
        payment_method: newOrder.paymentMethod,
        status: newOrder.status,
        notes: newOrder.notes,
      })
      .select()
      .single();

    if (!error && data) {
      newOrder.id = data.id;
    }
  }

  currentOrders.unshift(newOrder);
  writeLocalJson(ORDERS_FILE, currentOrders);
  return newOrder;
}

export async function updateOrderStatus(id, status) {
  if (isSupabaseConfigured && supabase) {
    await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  }

  const current = readLocalJson(ORDERS_FILE);
  const index = current.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index !== -1) {
    current[index].status = status;
    current[index].updatedAt = new Date().toISOString();
    writeLocalJson(ORDERS_FILE, current);
    return current[index];
  }
  return null;
}

export async function deleteOrder(id) {
  if (isSupabaseConfigured && supabase) {
    await supabase.from("orders").delete().eq("id", id);
  }

  const current = readLocalJson(ORDERS_FILE);
  const filtered = current.filter((o) => o.id !== id && o.orderNumber !== id);
  writeLocalJson(ORDERS_FILE, filtered);
  return true;
}

// ==========================================
// DASHBOARD METRICS / STATS
// ==========================================

export async function getDashboardStats() {
  const products = await getAllProducts();
  const orders = await getAllOrders();

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.stock === "in").length;
  const lowStockCount = products.filter((p) => p.stock === "low").length;
  const outOfStockCount = products.filter((p) => p.stock === "out").length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

  return {
    totalProducts,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    totalRevenue,
    isSupabaseConnected: isSupabaseConfigured,
  };
}
