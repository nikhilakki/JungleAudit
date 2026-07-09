#!/usr/bin/env python3
"""Generate a synthetic Amazon "Request My Data" export for demos.

Mirrors the real amazon.in export layout (folder names, CSV headers, value
formats, UTF-8 BOM) with entirely fictional data. Deterministic: same seed →
same files.

Usage: python3 scripts/generate-demo-data.py [output-dir]   (default: demo-data)
"""

import csv
import random
import sys
from datetime import datetime, timedelta
from pathlib import Path

rng = random.Random(42)

OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "demo-data")
ORDERS_DIR = OUT / "Your Amazon Orders"
RETURNS_DIR = OUT / "Your Returns & Refunds"

START = datetime(2023, 1, 3)
END = datetime(2026, 6, 28)

# (name, base price INR, category weight)
CATALOG = [
    ("Wireless Earbuds with Active Noise Cancellation (Black)", 2999, 3),
    ("USB-C Fast Charging Cable 1.5m (Braided, 2-Pack)", 449, 5),
    ("Smart LED Bulb 9W (WiFi, Colour Changing)", 599, 4),
    ("Stainless Steel Insulated Water Bottle 1L", 899, 4),
    ("Bluetooth Mechanical Keyboard (Hot-Swappable, 75%)", 4499, 2),
    ("Ergonomic Wireless Mouse (Silent Click)", 1299, 3),
    ("Laptop Stand Aluminium (Adjustable Height)", 1799, 2),
    ("Robot Vacuum Cleaner with Mopping (LiDAR)", 21999, 1),
    ("Air Fryer 4.2L Digital (1400W)", 4999, 2),
    ("Non-Stick Cookware Set (5 Pieces)", 2499, 2),
    ("Masala Chai Premium Blend 500g", 349, 6),
    ("Arabica Whole Coffee Beans 1kg (Medium Roast)", 1099, 5),
    ("Organic Peanut Butter Crunchy 1kg", 399, 6),
    ("Basmati Rice Premium 5kg", 799, 5),
    ("Extra Virgin Olive Oil 1L", 949, 4),
    ("Dishwashing Liquid Refill 2L (Lemon)", 299, 6),
    ("Bamboo Toothbrush (Pack of 4)", 249, 5),
    ("Cotton Bath Towel Set (2 Large, Grey)", 1199, 3),
    ("Microfibre Bedsheet King Size (Floral Print)", 1599, 2),
    ("Memory Foam Pillow (Cervical Support)", 1399, 2),
    ("Yoga Mat 6mm (Anti-Slip, Purple)", 999, 3),
    ("Adjustable Dumbbell Set 20kg (Pair)", 5499, 1),
    ("Running Shoes Men's Cushioned (Blue, UK 9)", 3299, 2),
    ("Cotton Crew Socks (Pack of 6)", 499, 5),
    ("Graphic Print T-Shirt Regular Fit (Navy, L)", 699, 4),
    ("Denim Jeans Slim Fit (Dark Wash, 32)", 1899, 2),
    ("The Psychology of Money (Paperback)", 299, 4),
    ("Atomic Habits (Paperback)", 449, 4),
    ("Project Hail Mary (Paperback)", 499, 3),
    ("A Brief History of Time (Paperback)", 350, 3),
    ("Sapiens: A Brief History of Humankind (Paperback)", 459, 3),
    ("Mystery Thriller Boxed Set (3 Books)", 1099, 2),
    ("Dog Food Adult Chicken & Rice 8kg", 2199, 3),
    ("Cat Litter Clumping 10L (Lavender)", 649, 4),
    ("Pet Grooming Brush (Self-Cleaning)", 549, 3),
    ("Monitor 27-inch QHD IPS (75Hz)", 18999, 1),
    ("Webcam 1080p with Privacy Shutter", 2799, 2),
    ("Portable SSD 1TB (USB 3.2)", 7499, 1),
    ("Power Bank 20000mAh (22.5W Fast Charge)", 1999, 3),
    ("Smartwatch with AMOLED Display (Midnight)", 6999, 1),
    ("Kindle Paperwhite Fabric Cover (Deep Sea Blue)", 1899, 2),
    ("Board Game: Settlers Strategy Edition", 2499, 2),
    ("LEGO-Compatible Building Blocks 500 Pcs", 1299, 2),
    ("Watercolour Paint Set 24 Shades with Brushes", 799, 3),
    ("A5 Dotted Journal Hardcover (Sage Green)", 549, 4),
    ("Gel Pens Assorted Colours (Pack of 12)", 299, 5),
    ("Desk Organiser Wooden (3 Compartments)", 899, 3),
    ("Table Lamp Warm White (Touch Dimmer)", 1499, 2),
    ("Indoor Plant Pot Ceramic Set of 2 (White)", 999, 3),
    ("Garden Seeds Kit: Herbs (6 Varieties)", 349, 4),
    ("Umbrella Windproof Compact (Auto Open)", 799, 3),
    ("Backpack 30L Water Resistant (Office/Travel)", 2299, 2),
    ("Trolley Suitcase 65cm Hard Shell (Teal)", 5999, 1),
    ("Sunscreen SPF 50 PA+++ 100ml", 449, 5),
    ("Vitamin C Face Serum 30ml", 699, 4),
    ("Shampoo Sulphate-Free 650ml (Argan Oil)", 749, 4),
    ("Electric Toothbrush (Sonic, 5 Modes)", 2999, 2),
    ("Beard Trimmer Cordless (90 min Runtime)", 1799, 2),
    ("Baby Wipes Unscented (Pack of 6 x 72)", 899, 4),
    ("Instant Camera Film Twin Pack", 1299, 2),
]

EBOOKS = [
    ("The Midnight Library (Kindle Edition)", 299),
    ("Deep Work (Kindle Edition)", 349),
    ("Ikigai (Kindle Edition)", 199),
    ("The Silent Patient (Kindle Edition)", 249),
    ("Tomorrow, and Tomorrow, and Tomorrow (Kindle Edition)", 399),
    ("Klara and the Sun (Kindle Edition)", 329),
    ("The Almanack of Naval Ravikant (Kindle Edition)", 0),
    ("Zero to One (Kindle Edition)", 299),
    ("Steve Jobs (Kindle Edition)", 449),
    ("The Pragmatic Programmer (Kindle Edition)", 1650),
    ("Designing Data-Intensive Applications (Kindle Edition)", 2200),
    ("The Design of Everyday Things (Kindle Edition)", 599),
    ("Thinking, Fast and Slow (Kindle Edition)", 399),
    ("The Three-Body Problem (Kindle Edition)", 349),
    ("Educated: A Memoir (Kindle Edition)", 299),
    ("Shoe Dog (Kindle Edition)", 249),
]

KU_BOOKS = [
    "The Housemaid",
    "Before the Coffee Gets Cold",
    "The Kaiju Preservation Society",
    "How to Stop Worrying and Start Living",
    "The Simple Path to Wealth",
    "Norwegian Wood",
    "The Rosie Project",
    "Eleven Rings",
    "A Man Called Ove",
    "The Lean Startup",
    "Kafka on the Shore",
    "Show Your Work!",
    "The Thursday Murder Club",
    "Steal Like an Artist",
    "What I Talk About When I Talk About Running",
]

PAYMENT_METHODS = [
    ("Amazon Pay UPI", 38),
    ("Visa - 4421", 22),
    ("Mastercard - 8802", 12),
    ("Gift Certificate/Card", 14),
    ("Gift Certificate/Card and Visa - 4421", 8),
    ("Amazon Pay Balance", 6),
]

SHIPPING_OPTIONS = [
    "next-in-grd-cod-eligible",
    "std-in-grd-cod-eligible",
    "rush",
    "scheduled-amazonnow",
    "same-in-grd",
]

RETURN_REASONS = [
    ("CR-QUALITY_UNACCEPTABLE", "Item defective or doesn't work"),
    ("CR-DAMAGED_BY_FC", "Damaged due to inappropriate packaging"),
    ("CR-ORDERED_WRONG_ITEM", "Bought by mistake"),
    ("CR-SWITCHEROO", "Item is different from what was ordered"),
    ("CR-MISSED_ESTIMATED_DELIVERY", "Item arrived too late"),
    ("UND-UNKNOWN", "Refused"),
]

# Month → relative order volume (festive spikes: Prime Day July, Diwali Oct/Nov, December)
SEASONALITY = {1: 0.8, 2: 0.6, 3: 0.8, 4: 0.9, 5: 1.0, 6: 0.9,
               7: 1.5, 8: 0.9, 9: 1.0, 10: 1.6, 11: 1.4, 12: 1.2}


def iso(dt, millis=False):
    if millis:
        return dt.strftime("%Y-%m-%dT%H:%M:%S.") + f"{rng.randrange(1000):03d}Z"
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def asin():
    return "B0" + "".join(rng.choice("0123456789ABCDEFGHJKLMNPQRSTUVWXYZ") for _ in range(8))


def order_id(prefix=None):
    prefix = prefix or rng.choice(["402", "403", "404", "405", "406", "407", "408"])
    return f"{prefix}-{rng.randrange(10**7):07d}-{rng.randrange(10**7):07d}"


def pick_payment():
    total = sum(w for _, w in PAYMENT_METHODS)
    r = rng.uniform(0, total)
    for name, w in PAYMENT_METHODS:
        r -= w
        if r <= 0:
            return name
    return PAYMENT_METHODS[0][0]


def write_csv(path, header, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        w.writerow(header)
        w.writerows(rows)
    print(f"  {path}  ({len(rows)} rows)")


# ---------------------------------------------------------------- Order History
catalog_asins = {name: asin() for name, _, _ in CATALOG}
orders = []          # dicts for downstream returns/refunds
order_rows = []

cursor = START
while cursor < END:
    month_factor = SEASONALITY[cursor.month]
    # ~2-4 orders a week scaled by season
    n_orders = max(0, round(rng.gauss(2.6 * month_factor, 1.1)))
    for _ in range(n_orders):
        odt = cursor + timedelta(days=rng.uniform(0, 7), hours=rng.uniform(6, 23))
        if odt >= END:
            continue
        oid = order_id()
        payment = pick_payment()
        n_items = rng.choices([1, 2, 3], weights=[72, 21, 7])[0]
        items = rng.sample(CATALOG, n_items)
        for name, base, _w in items:
            qty = rng.choices([1, 2], weights=[88, 12])[0]
            total = round(base * qty * rng.uniform(0.82, 1.08))  # discounts / price drift
            unit_tax = round(total * 0.152, 2)
            unit_price = round(total - unit_tax, 2)
            ship_dt = odt + timedelta(hours=rng.uniform(4, 60))
            orders.append({"oid": oid, "date": odt, "name": name,
                           "asin": catalog_asins[name], "total": total, "qty": qty})
            order_rows.append([
                catalog_asins[name], "Not Applicable", f"ATS({rng.randrange(10**9)})", "INR",
                "Not Applicable", "Not Applicable", "Not Applicable", "Not Applicable",
                iso(odt), oid, "Closed", qty, payment, "New", name,
                "Not Applicable", iso(ship_dt, millis=rng.random() < 0.4),
                f"{unit_price}", f"{unit_tax}", "Shipped",
                "Aarav Demo 42 Lakeview Apartments, MG Road BENGALURU KARNATAKA 560001 India",
                "0", rng.choice(SHIPPING_OPTIONS), f"{total}", "0",
                f"{unit_price}", f"{unit_tax}", "Amazon.in",
            ])
    cursor += timedelta(days=7)

# One memorable big-ticket purchase for the charts
big_dt = datetime(2025, 10, 21, 11, 5, 33)
big_oid = order_id()
big_asin = asin()
orders.append({"oid": big_oid, "date": big_dt, "name": "Laptop 14-inch (16GB RAM, 512GB SSD)",
               "asin": big_asin, "total": 62990, "qty": 1})
order_rows.append([
    big_asin, "Not Applicable", f"ATS({rng.randrange(10**9)})", "INR",
    "Not Applicable", "Not Applicable", "Not Applicable", "Not Applicable",
    iso(big_dt), big_oid, "Closed", 1, "Visa - 4421", "New",
    "Laptop 14-inch (16GB RAM, 512GB SSD)", "Not Applicable",
    iso(big_dt + timedelta(hours=20)), "54677.28", "8312.72", "Shipped",
    "Aarav Demo 42 Lakeview Apartments, MG Road BENGALURU KARNATAKA 560001 India",
    "0", "next-in-grd-cod-eligible", "62990", "0", "54677.28", "8312.72", "Amazon.in",
])

order_rows.sort(key=lambda r: r[8], reverse=True)

ORDER_HEADER = ["ASIN", "Billing Address", "Carrier Name & Tracking Number", "Currency",
                "Gift Message", "Gift Recipient Contact", "Gift Sender Name", "Item Serial Number",
                "Order Date", "Order ID", "Order Status", "Original Quantity", "Payment Method Type",
                "Product Condition", "Product Name", "Purchase Order Number", "Ship Date",
                "Shipment Item Subtotal", "Shipment Item Subtotal Tax", "Shipment Status",
                "Shipping Address", "Shipping Charge", "Shipping Option", "Total Amount",
                "Total Discounts", "Unit Price", "Unit Price Tax", "Website"]

# ------------------------------------------------------- Digital Content Orders
DIGITAL_HEADER = ["ASIN", "Affected Item Quantity", "Alternative Order Providing Payment",
                  "Base Currency", "Base Currency Code", "Billing Address", "Claim Code",
                  "Component Type", "Country Code", "Customer Declared Address",
                  "Declared Country Code", "Delivery Date", "Delivery Packet ID", "Delivery Status",
                  "Digital Order Item Attributes", "Digital Order Item ID",
                  "Does Order Depend on Another Order", "FX Currency Code", "FX Transaction Amount",
                  "Fulfilled Date", "Fulfillment Mobile Number", "Fullfilment Status",
                  "Gift Claim Date", "Gift Customer Nickname", "Gift Email", "Gift Item",
                  "Gift Message", "Gift Redemption", "Installment Our Price",
                  "Installment Our Price Plus Tax", "Installment Price Currency Code",
                  "Installment Price Plus Tax Currency Code", "Is Order Eligible for Prime Benefit",
                  "Is Order Free Replacement", "Is Order a Preorder", "Item Fulfilled",
                  "Item Merged from Another Order", "List Price Amount", "List Price Currency Code",
                  "List Price Tax Amount", "List Price Tax Currency Code", "Marketplace",
                  "Multifactor Authentication Status (depreciated)", "Offer Type Code",
                  "Offering SKU", "Order Date", "Order ID", "Order Status",
                  "Ordering Customer Nickname", "Original Quantity", "Paid by Other Customer",
                  "Payment Information", "Previously Paid Digital Order Item ID",
                  "PreviouslyPaidOrderId", "Price", "Price Currency Code", "Price Tax",
                  "Price Tax Currency Code", "Product Name", "Publisher", "Quantity Ordered",
                  "Recharge Amount", "Recharge Amount Currency Code", "Recipient Email",
                  "Related Physical Order ID", "Seller of Record", "Session ID", "Ship From",
                  "Ship To", "Shipping Address", "Shopping Marketplace ID",
                  "Subscription Order Info List", "Subscription Order Type",
                  "Third Party Display Currency Code", "Third Party Display Price",
                  "Transaction Amount", "Unique Browser ID"]

NA = "Not Applicable"
digital_rows = []
digital_purchases = []
for name, price in EBOOKS:
    # 1-2 purchase events per title across the window
    for _ in range(rng.choices([1, 2], weights=[80, 20])[0]):
        odt = START + timedelta(days=rng.uniform(0, (END - START).days))
        doid = f"D01-{rng.randrange(10**7):07d}-{rng.randrange(10**7):07d}"
        a = asin()
        promo = price == 0 or rng.random() < 0.08
        paid = 0.0 if promo else round(price * rng.uniform(0.85, 1.0))
        tax_part = round(paid * 0.152, 2)
        price_part = round(paid - tax_part, 2)
        digital_purchases.append({"oid": doid, "date": odt, "name": name, "asin": a, "paid": paid})
        base = [a, NA, NA, NA, "INR", NA, NA, None, "IN", NA, NA, iso(odt), NA, "DELIVERED",
                NA, f"{rng.randrange(10**12)}", "No", NA, NA, iso(odt), NA, "Yes",
                NA, NA, NA, "No", NA, NA, NA, NA, NA, NA, "Yes", "No", "No", "Yes", "No",
                f"{price}.0", "INR", "0.0", "INR", "www.amazon.in", NA,
                "Promotion" if promo else NA, NA, iso(odt), doid, "SUCCESS", "aarav_demo",
                "1", "No", "Amazon Pay UPI" if not promo else NA, NA, NA,
                f"{price}.0", "INR", "0.0", "INR", name, NA, "1", NA, NA, NA, NA,
                "Amazon Asia Pacific Holding Private Limited", f"{rng.randrange(10**9)}",
                NA, NA, NA, "A21TJRUUN4KGV", NA, NA, NA, NA, None, f"{rng.randrange(10**10)}"]
        for comp, amount in (("Price Amount", price_part), ("Tax", tax_part)):
            row = base.copy()
            row[7] = comp
            row[-2] = f"{amount}"
            digital_rows.append(row)

digital_rows.sort(key=lambda r: r[45], reverse=True)

# ------------------------------------------------------- Digital Borrowed Items
BORROWED_HEADER = ["ASIN", "Author", "Content Type", "Country Code", "Delivery Device Name",
                   "End Date", "Is First Content Loan", "Loan Acceptance Date",
                   "Loan Creation Date", "Loan Program", "Loan Status", "Marketplace",
                   "Product Name", "Recipient Email ID"]
AUTHORS = ["F. Green", "T. Kaur", "M. Okafor", "S. Lindqvist", "R. Iyer", "J. Whitfield",
           "A. Moreno", "K. Tanaka", "P. Deshmukh", "L. Novak"]
borrowed_rows = []
for i, title in enumerate(KU_BOOKS * 3):  # ~45 loans
    ldt = START + timedelta(days=rng.uniform(0, (END - START).days))
    active = ldt > END - timedelta(days=30) and rng.random() < 0.6
    end = "ACTIVE" if active else iso(ldt + timedelta(days=rng.uniform(4, 30)))
    borrowed_rows.append([
        asin(), rng.choice(AUTHORS), "EBOOK", "IN", "Aarav's Kindle",
        end, "Yes" if i < len(KU_BOOKS) else "No", "Not Available", iso(ldt),
        "Kindle Unlimited", "BORROWED" if active else "LOAN EXPIRED",
        "www.amazon.in", title, "Not Applicable",
    ])
borrowed_rows.sort(key=lambda r: r[8], reverse=True)

# --------------------------------------------------------------- Returns cluster
returned = [o for o in orders if o["total"] >= 400 and rng.random() < 0.075]

RETURN_REQ_HEADER = ["ASIN", "Order ID", "Product Name", "Return Reason Code",
                     "Return Shipping Method"]
RETURNS_STATUS_HEADER = ["Carrier Package ID", "Carrier Tracking ID", "Charge Status",
                         "Contract Creation Date", "Contract ID", "Contract Unit ID",
                         "Date of Return", "Gift Card", "Order ID", "Payment Method Service Type",
                         "Replacement Order", "Retrocharge Resolution", "Return Amount",
                         "Return Amount Currency", "Return Authorization ID",
                         "Return Creation Date", "Return Reason",
                         "Return Receivable Creation Reason", "Return Receivable Initiation Date",
                         "Return Receivable State", "Return Receivable Tracking ID",
                         "Return Resolution", "Return Ship Option"]
REFUND_HEADER = ["Creation Date", "Currency", "Direct Debit Refund Amount", "Disbursement Type",
                 "Order ID", "Payment Status", "Quantity", "Refund Amount", "Refund Date",
                 "Reversal Amount State", "Reversal Reason", "Reversal Status", "Website"]
REPLACEMENT_HEADER = ["Order ID", "Replacement Order ID"]

req_rows, status_rows, refund_rows, replacement_rows = [], [], [], []
for i, o in enumerate(returned):
    code, human = rng.choice(RETURN_REASONS)
    rdt = o["date"] + timedelta(days=rng.uniform(2, 12))
    exchange = rng.random() < 0.18
    req_rows.append([o["asin"], o["oid"], o["name"], code,
                     rng.choice(["ATS_STANDARD", "ATS_SELLER"])])
    status_rows.append([
        NA, f"AMZ{rng.randrange(10**10)}", NA, NA, f"{rng.randrange(10**10)}", "1",
        iso(rdt), NA, o["oid"], NA, NA, NA,
        "No Refund" if exchange else f"{o['total']:.2f}",
        "Not Available" if exchange else "INR",
        f"RMA{rng.randrange(10**8)}", iso(rdt - timedelta(hours=rng.uniform(1, 30))),
        human, NA, NA, NA, NA, "Exchange" if exchange else "Refund", "Pickup",
    ])
    if exchange:
        replacement_rows.append([o["oid"], order_id()])
    else:
        refund_amt = f"{o['total']:,}" if o["total"] >= 1000 else f"{o['total']}"
        rfdt = rdt + timedelta(hours=rng.uniform(2, 72))
        refund_rows.append([
            iso(rfdt, millis=True), "INR", "0", "Refund", o["oid"], "Completed", o["qty"],
            refund_amt, iso(rfdt + timedelta(hours=rng.uniform(1, 48)), millis=True),
            NA, "Customer return", NA, "Amazon.in",
        ])

# --------------------------------------------------------------------- Cart
CART_HEADER = ["ASIN", "Add-on Item", "Cart Domain", "Cart List", "Cart Source",
               "Date Added to Cart", "Gift Wrapped", "One-Click Enabled", "Order Quantity",
               "Pantry Item", "Prime Subscription", "Product Name"]
cart_rows = []
for name, _p, _w in rng.sample(CATALOG, 6):
    cdt = END - timedelta(days=rng.uniform(0, 120))
    cart_rows.append([catalog_asins[name], "No", NA, rng.choice(["active", "saved"]),
                      "Retail", iso(cdt, millis=True), "No", "No", "1", "No", "No", name])

# --------------------------------------------------------------------- Write
print(f"Writing demo export to {OUT}/")
write_csv(ORDERS_DIR / "Order History.csv", ORDER_HEADER, order_rows)
write_csv(ORDERS_DIR / "Digital Content Orders.csv", DIGITAL_HEADER, digital_rows)
write_csv(ORDERS_DIR / "Digital Borrowed Items.csv", BORROWED_HEADER, borrowed_rows)
write_csv(ORDERS_DIR / "Cart History.csv", CART_HEADER, cart_rows)
write_csv(RETURNS_DIR / "Return Requests.csv", RETURN_REQ_HEADER, req_rows)
write_csv(RETURNS_DIR / "Returns Status.csv", RETURNS_STATUS_HEADER, status_rows)
write_csv(RETURNS_DIR / "Refund Details.csv", REFUND_HEADER, refund_rows)
write_csv(RETURNS_DIR / "Replacement Orders.csv", REPLACEMENT_HEADER, replacement_rows)

gross = sum(o["total"] for o in orders)
refunds = sum(o["total"] for o in returned if True)
print(f"\nStory: {len({o['oid'] for o in orders})} physical orders, "
      f"{len(order_rows)} item rows, gross ₹{gross:,}")
print(f"Returns: {len(returned)} ({len(refund_rows)} refunds, {len(replacement_rows)} exchanges)")
print(f"Digital: {len(digital_purchases)} ebook purchases, {len(borrowed_rows)} KU loans")
