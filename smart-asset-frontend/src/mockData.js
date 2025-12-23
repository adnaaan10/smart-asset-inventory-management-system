// Mock Assets
export const mockAssets = [
  { id: 1, name: "Dell Latitude 5420", type: "Laptop", serial: "DL5420A", status: "Assigned", user: "john" },
  { id: 2, name: "HP Z24 Monitor", type: "Monitor", serial: "HPZ24B", status: "Available", user: null },
  { id: 3, name: "MacBook Pro M1", type: "Laptop", serial: "MBP2021", status: "Under Repair", user: null },
  { id: 4, name: "Lenovo ThinkPad X1", type: "Laptop", serial: "LNX1C", status: "Assigned", user: "alice" },
  { id: 5, name: "Samsung Curved Monitor", type: "Monitor", serial: "SAMC27", status: "Available", user: null },
  { id: 6, name: "iPad Air 5", type: "Tablet", serial: "IPAD5A", status: "Assigned", user: "kiran" },
  { id: 7, name: "Dell Dock WD19", type: "Accessory", serial: "DDWD19", status: "Available", user: null },
  { id: 8, name: "HP EliteBook 840", type: "Laptop", serial: "HPE840", status: "Under Repair", user: null },
  { id: 9, name: "Logitech Webcam C920", type: "Accessory", serial: "LGC920", status: "Assigned", user: "suresh" },
  { id: 10, name: "Asus VivoBook", type: "Laptop", serial: "ASVIVO1", status: "Available", user: null },
  { id: 11, name: "Microsoft Surface Pro", type: "Tablet", serial: "MSPRO7", status: "Assigned", user: "arjun" },
  { id: 12, name: "Dell Inspiron", type: "Laptop", serial: "DLINSP", status: "Available", user: null },
  { id: 13, name: "HP LaserJet Printer", type: "Printer", serial: "HPLJ200", status: "Assigned", user: "office" },
  { id: 14, name: "Canon Scanner", type: "Scanner", serial: "CNSCAN", status: "Available", user: null },
  { id: 15, name: "Lenovo Monitor 24\"", type: "Monitor", serial: "LNMON24", status: "Under Repair", user: null },
  { id: 16, name: "Dell Precision 5560", type: "Laptop", serial: "DLPR5560", status: "Assigned", user: "mary" },
  { id: 17, name: "HP ProDesk", type: "Desktop", serial: "HPDESK1", status: "Available", user: null },
  { id: 18, name: "iPhone 14", type: "Mobile", serial: "IPH14A", status: "Assigned", user: "manager" },
  { id: 19, name: "Samsung Galaxy Tab", type: "Tablet", serial: "SGTAB9", status: "Available", user: null },
  { id: 20, name: "Dell OptiPlex", type: "Desktop", serial: "DLOPTI", status: "Under Repair", user: null },
  { id: 21, name: "Noise Cancelling Headset", type: "Accessory", serial: "HEADNC1", status: "Available", user: null },
  { id: 22, name: "Apple Magic Keyboard", type: "Accessory", serial: "AMK001", status: "Assigned", user: "design" },
  { id: 23, name: "USB-C Hub", type: "Accessory", serial: "USBCHUB", status: "Available", user: null },
  { id: 24, name: "Projector Epson", type: "Projector", serial: "EPPRJ1", status: "Assigned", user: "conference" },
  { id: 25, name: "Network Switch", type: "Network", serial: "NETSW24", status: "Available", user: null },
];



// Mock Inventory Items
export const mockInventory = [
  { id: 1, name: "Keyboard", quantity: 20, threshold: 5 },
  { id: 2, name: "Mouse", quantity: 18, threshold: 5 },
  { id: 3, name: "HDMI Cable", quantity: 4, threshold: 6 }, // Low
  { id: 4, name: "USB-C Cable", quantity: 25, threshold: 8 },
  { id: 5, name: "Laptop Charger", quantity: 2, threshold: 5 }, // Critical
  { id: 6, name: "Ethernet Cable", quantity: 40, threshold: 10 },
  { id: 7, name: "Webcam", quantity: 6, threshold: 5 },
  { id: 8, name: "Headset", quantity: 14, threshold: 6 },
  { id: 9, name: "Monitor Stand", quantity: 3, threshold: 5 }, // Low
  { id: 10, name: "Mouse Pad", quantity: 30, threshold: 10 },
  { id: 11, name: "Power Extension", quantity: 5, threshold: 7 }, // Low
  { id: 12, name: "Router", quantity: 6, threshold: 3 },
  { id: 13, name: "Printer Ink", quantity: 2, threshold: 4 }, // Critical
  { id: 14, name: "Laptop Bag", quantity: 10, threshold: 5 },
  { id: 15, name: "UPS Battery", quantity: 1, threshold: 2 }, // Critical
];

// Mock Tickets
export const mockTickets = [
  {
    id: 1,
    asset: "MacBook Pro M1",
    issue: "Screen flicker",
    status: "Open",
    technician: "raj",
    reported_by: "john",
  },
  {
    id: 2,
    asset: "Dell Latitude 5420",
    issue: "Battery replacement",
    status: "In Progress",
    technician: "mary",
    reported_by: "john",
  },
  {
    id: 3,
    asset: "HP Z24 Monitor",
    issue: "No display",
    status: "Resolved",
    technician: "mike",
    reported_by: "alice",
  },
  {
    id: 4,
    asset: "Lenovo ThinkPad X1",
    issue: "Keyboard issue",
    status: "Open",
    technician: "mike",
    reported_by: "alice",
  },
  {
    id: 5,
    asset: "iPad Air 5",
    issue: "Charging problem",
    status: "In Progress",
    technician: "Mike",
    reported_by: "kiran",
  },
  {
    id: 6,
    asset: "HP EliteBook 840",
    issue: "Overheating",
    status: "Resolved",
    technician: "Mike",
    reported_by: "kiran",
  },
  {
    id: 7,
    asset: "Dell Precision 5560",
    issue: "Blue screen error",
    status: "Open",
    technician: "Mike",
    reported_by: "mary",
  },
  {
    id: 8,
    asset: "Samsung Curved Monitor",
    issue: "Color distortion",
    status: "In Progress",
    technician: "arjun",
    reported_by: "suresh",
  },
  {
    id: 9,
    asset: "Dell OptiPlex",
    issue: "Power supply issue",
    status: "Resolved",
    technician: "raj",
    reported_by: "office",
  },
  {
    id: 10,
    asset: "Projector Epson",
    issue: "Lamp failure",
    status: "Open",
    technician: "suresh",
    reported_by: "conference",
  },
  {
    id: 11,
    asset: "Network Switch",
    issue: "Port not working",
    status: "In Progress",
    technician: "mary",
    reported_by: "admin",
  },
  {
    id: 12,
    asset: "HP LaserJet Printer",
    issue: "Paper jam",
    status: "Resolved",
    technician: "arjun",
    reported_by: "office",
  },
];



// Mock User
export const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@company.com",
    role: "ADMIN",
    status: "Active",
  },
  {
    id: 2,
    name: "John Employee",
    email: "john@company.com",
    role: "EMPLOYEE",
    status: "Active",
  },
  {
    id: 3,
    name: "Mike",
    email: "mike@company.com",
    role: "TECHNICIAN",
    status: "Active",
  },
];

// Mock Assignments
export const mockAssignments = [
  {
    id: 1,
    asset: "Dell Latitude 5420",
    user: "john",
    status: "ACTIVE",
    assigned_date: "2025-01-10",
  },
  {
    id: 2,
    asset: "Lenovo ThinkPad X1",
    user: "alice",
    status: "ACTIVE",
    assigned_date: "2025-01-05",
  },
  {
    id: 3,
    asset: "iPad Air 5",
    user: "kiran",
    status: "ACTIVE",
    assigned_date: "2025-01-12",
  },
  {
    id: 4,
    asset: "Logitech Webcam C920",
    user: "suresh",
    status: "ACTIVE",
    assigned_date: "2025-01-08",
  },
  {
    id: 5,
    asset: "Microsoft Surface Pro",
    user: "arjun",
    status: "ACTIVE",
    assigned_date: "2024-12-28",
  },
  {
    id: 6,
    asset: "HP LaserJet Printer",
    user: "office",
    status: "ACTIVE",
    assigned_date: "2024-12-20",
  },
  {
    id: 7,
    asset: "Dell Precision 5560",
    user: "mary",
    status: "ACTIVE",
    assigned_date: "2025-01-02",
  },
  {
    id: 8,
    asset: "iPhone 14",
    user: "manager",
    status: "ACTIVE",
    assigned_date: "2025-01-15",
  },
  {
    id: 9,
    asset: "Apple Magic Keyboard",
    user: "design",
    status: "ACTIVE",
    assigned_date: "2024-12-18",
  },
  {
    id: 10,
    asset: "Projector Epson",
    user: "conference",
    status: "ACTIVE",
    assigned_date: "2024-11-30",
  },

  // Returned assignment (history example)
  {
    id: 11,
    asset: "HP Z24 Monitor",
    user: "john",
    status: "RETURNED",
    assigned_date: "2024-10-05",
    returned_date: "2024-12-01",
  },
];

