import { X, Database, HardDrive, Activity, Zap, TrendingUp, Clock, Server, AlertCircle, ChevronDown, ChevronUp, Table, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface DatabaseDetailPanelProps {
  dbName: string;
  dbType: string;
  computerName: string;
  dataType: string;
  onClose: () => void;
}

// Mock database details
const getDatabaseDetails = (dbName: string, dbType: string, dataType: string) => {
  const baseData = {
    "SQL Server": {
      version: "SQL Server 2022 (16.0.1000.6)",
      edition: "Enterprise Edition",
      port: 1433,
      host: "db-prod-01.warehouse.local",
      charset: "UTF8",
      collation: "SQL_Latin1_General_CP1_CI_AS",
    },
    "PostgreSQL": {
      version: "PostgreSQL 15.3",
      edition: "Standard",
      port: 5432,
      host: "db-prod-02.warehouse.local",
      charset: "UTF8",
      collation: "en_US.utf8",
    },
    "MongoDB": {
      version: "MongoDB 7.0.2",
      edition: "Enterprise",
      port: 27017,
      host: "db-prod-03.warehouse.local",
      charset: "UTF8",
      collation: "utf8_general_ci",
    },
    "RabbitMQ": {
      version: "RabbitMQ 3.12.6",
      edition: "Enterprise",
      port: 5672,
      host: "mq-prod-01.warehouse.local",
      charset: "UTF8",
      collation: "N/A",
    },
  };

  const isProd = dbType === "Production";
  // Map dataType to baseData keys (handle "SQL" -> "SQL Server")
  const dataTypeKey = dataType === "SQL" ? "SQL Server" : dataType;
  const base = baseData[dataTypeKey as keyof typeof baseData];

  // Handle case where dataType is not found
  if (!base) {
    console.error(`Unknown dataType: ${dataType}`);
    return {
      connection: { host: "Unknown", port: 0, status: "Unknown", uptime: "N/A" },
      configuration: { version: "N/A", edition: "N/A", charset: "N/A", collation: "N/A", maxConnections: 0, currentConnections: 0 },
      performance: { avgQueryTime: "N/A", transactions: "N/A", cacheHitRatio: "N/A", ioThroughput: "N/A" },
      storage: { totalSize: "N/A", dataSize: "N/A", indexSize: "N/A", logSize: "N/A", growth: "N/A" },
    };
  }

  if (dataType === "RabbitMQ") {
    return {
      connection: {
        host: isProd ? base.host : base.host.replace("prod", "sandbox"),
        port: base.port,
        managementPort: 15672,
        status: isProd ? "Active" : "Active",
        uptime: isProd ? "127d 14h 23m" : "45d 8h 12m",
      },
      configuration: {
        version: base.version,
        edition: base.edition,
        erlangVersion: "26.1.2",
        clusterMode: isProd ? "Clustered (3 nodes)" : "Single Node",
        maxConnections: isProd ? 300 : 100,
        currentConnections: isProd ? 124 : 18,
      },
      performance: {
        avgLatency: isProd ? "3ms" : "2ms",
        messagesPerMin: isProd ? "42.5k/min" : "2.8k/min",
        publishRate: isProd ? "710/s" : "47/s",
        deliveryRate: isProd ? "698/s" : "45/s",
        ackRate: isProd ? "692/s" : "44/s",
      },
      resources: {
        memoryUsed: isProd ? "2.4 GB" : "512 MB",
        memoryLimit: isProd ? "8 GB" : "2 GB",
        diskFree: isProd ? "187 GB" : "245 GB",
        fileDescriptors: isProd ? "1,245 / 65,536" : "234 / 32,768",
        socketDescriptors: isProd ? "248 / 58,982" : "36 / 29,491",
      },
    };
  }

  return {
    connection: {
      host: isProd ? base.host : base.host.replace("prod", "sandbox"),
      port: base.port,
      status: isProd ? "Active" : "Active",
      uptime: isProd ? "127d 14h 23m" : "45d 8h 12m",
    },
    configuration: {
      version: base.version,
      edition: base.edition,
      charset: base.charset,
      collation: base.collation,
      maxConnections: isProd ? (dbName === "MongoDB" ? 500 : dbName === "SQL Server" ? 500 : 400) : 200,
      currentConnections: isProd ? (dbName === "MongoDB" ? 356 : dbName === "SQL Server" ? 247 : 182) : (dbName === "MongoDB" ? 62 : dbName === "SQL Server" ? 45 : 28),
    },
    performance: {
      avgQueryTime: isProd ? (dbName === "MongoDB" ? "24ms" : dbName === "SQL Server" ? "12ms" : "8ms") : "15-19ms",
      transactions: isProd ? (dbName === "MongoDB" ? "15.7k/min" : dbName === "SQL Server" ? "8.5k/min" : "12.3k/min") : "0.9-1.8k/min",
      cacheHitRatio: isProd ? "98.7%" : "96.2%",
      ioThroughput: isProd ? "2.4 GB/s" : "640 MB/s",
    },
    storage: {
      totalSize: isProd ? (dbName === "MongoDB" ? "384 GB" : dbName === "SQL Server" ? "142 GB" : "218 GB") : (dbName === "MongoDB" ? "94 GB" : dbName === "SQL Server" ? "38 GB" : "52 GB"),
      dataSize: isProd ? (dbName === "MongoDB" ? "298 GB" : dbName === "SQL Server" ? "110 GB" : "169 GB") : (dbName === "MongoDB" ? "73 GB" : dbName === "SQL Server" ? "29 GB" : "40 GB"),
      indexSize: isProd ? (dbName === "MongoDB" ? "62 GB" : dbName === "SQL Server" ? "24 GB" : "38 GB") : (dbName === "MongoDB" ? "16 GB" : dbName === "SQL Server" ? "7 GB" : "9 GB"),
      logSize: isProd ? (dbName === "MongoDB" ? "24 GB" : dbName === "SQL Server" ? "8 GB" : "11 GB") : (dbName === "MongoDB" ? "5 GB" : dbName === "SQL Server" ? "2 GB" : "3 GB"),
      growth: isProd ? (dbName === "MongoDB" ? "+8.2 GB/week" : dbName === "SQL Server" ? "+2.3 GB/week" : "+3.8 GB/week") : "+0.5-1.2 GB/week",
    },
  };
};

// Mock expensive queries
const getExpensiveQueries = (dbName: string, dbType: string) => {
  const sqlServerQueries = [
    {
      id: 1,
      query: "SELECT o.*, c.customer_name, p.* FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id WHERE o.created_at > DATEADD(day, -30, GETDATE())",
      executionTime: "2,847ms",
      executionCount: 12456,
      avgTime: "2,847ms",
      cpuTime: "1,923ms",
      logicalReads: "45,678",
      database: "WMS_Production",
    },
    {
      id: 2,
      query: "UPDATE inventory SET quantity = quantity - @qty, last_updated = GETDATE() WHERE sku = @sku AND location_id = @loc",
      executionTime: "1,923ms",
      executionCount: 89234,
      avgTime: "1,923ms",
      cpuTime: "1,456ms",
      logicalReads: "34,521",
      database: "WMS_Production",
    },
    {
      id: 3,
      query: "SELECT * FROM transaction_history WHERE warehouse_id IN (SELECT id FROM warehouses WHERE region = 'WEST') ORDER BY transaction_date DESC",
      executionTime: "1,654ms",
      executionCount: 5678,
      avgTime: "1,654ms",
      cpuTime: "1,234ms",
      logicalReads: "28,934",
      database: "WMS_Production",
    },
    {
      id: 4,
      query: "INSERT INTO audit_log (user_id, action, entity_type, entity_id, timestamp, details) VALUES (@uid, @action, @type, @eid, GETDATE(), @details)",
      executionTime: "1,456ms",
      executionCount: 156789,
      avgTime: "1,456ms",
      cpuTime: "892ms",
      logicalReads: "23,456",
      database: "WMS_Production",
    },
    {
      id: 5,
      query: "SELECT w.*, COUNT(i.id) as item_count FROM worklists w LEFT JOIN worklist_items i ON w.id = i.worklist_id GROUP BY w.id HAVING COUNT(i.id) > 0",
      executionTime: "1,234ms",
      executionCount: 23456,
      avgTime: "1,234ms",
      cpuTime: "845ms",
      logicalReads: "19,872",
      database: "WMS_Production",
    },
    {
      id: 6,
      query: "DELETE FROM temp_processing WHERE created_at < DATEADD(hour, -24, GETDATE())",
      executionTime: "987ms",
      executionCount: 1440,
      avgTime: "987ms",
      cpuTime: "654ms",
      logicalReads: "15,234",
      database: "WMS_Production",
    },
    {
      id: 7,
      query: "SELECT p.*, SUM(i.quantity) as total_qty FROM products p JOIN inventory i ON p.id = i.product_id WHERE p.category = @cat GROUP BY p.id",
      executionTime: "876ms",
      executionCount: 8934,
      avgTime: "876ms",
      cpuTime: "567ms",
      logicalReads: "12,345",
      database: "WMS_Production",
    },
    {
      id: 8,
      query: "UPDATE order_status SET status = 'COMPLETED', completed_at = GETDATE() WHERE order_id = @oid AND status = 'PROCESSING'",
      executionTime: "765ms",
      executionCount: 45678,
      avgTime: "765ms",
      cpuTime: "489ms",
      logicalReads: "9,876",
      database: "WMS_Production",
    },
    {
      id: 9,
      query: "SELECT DISTINCT location_id, zone FROM storage_locations WHERE available_capacity > @min_capacity ORDER BY zone, location_id",
      executionTime: "654ms",
      executionCount: 12345,
      avgTime: "654ms",
      cpuTime: "423ms",
      logicalReads: "8,765",
      database: "WMS_Production",
    },
    {
      id: 10,
      query: "SELECT TOP 100 * FROM event_log WHERE event_type = 'ERROR' AND created_at > DATEADD(hour, -1, GETDATE()) ORDER BY created_at DESC",
      executionTime: "543ms",
      executionCount: 34567,
      avgTime: "543ms",
      cpuTime: "356ms",
      logicalReads: "6,543",
      database: "WMS_Production",
    },
  ];

  const postgresQueries = [
    {
      id: 1,
      query: "SELECT o.*, c.customer_name, p.* FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id WHERE o.created_at > NOW() - INTERVAL '30 days'",
      executionTime: "2,124ms",
      executionCount: 15678,
      avgTime: "2,124ms",
      cpuTime: "1,678ms",
      logicalReads: "52,341",
      database: "wms_production",
    },
    {
      id: 2,
      query: "UPDATE inventory SET quantity = quantity - $1, last_updated = NOW() WHERE sku = $2 AND location_id = $3",
      executionTime: "1,789ms",
      executionCount: 98765,
      avgTime: "1,789ms",
      cpuTime: "1,234ms",
      logicalReads: "38,765",
      database: "wms_production",
    },
    {
      id: 3,
      query: "SELECT * FROM transaction_history WHERE warehouse_id IN (SELECT id FROM warehouses WHERE region = 'WEST') ORDER BY transaction_date DESC LIMIT 1000",
      executionTime: "1,567ms",
      executionCount: 6789,
      avgTime: "1,567ms",
      cpuTime: "1,123ms",
      logicalReads: "31,234",
      database: "wms_production",
    },
    {
      id: 4,
      query: "INSERT INTO audit_log (user_id, action, entity_type, entity_id, timestamp, details) VALUES ($1, $2, $3, $4, NOW(), $5)",
      executionTime: "1,345ms",
      executionCount: 178945,
      avgTime: "1,345ms",
      cpuTime: "823ms",
      logicalReads: "25,678",
      database: "wms_production",
    },
    {
      id: 5,
      query: "SELECT w.*, COUNT(i.id) as item_count FROM worklists w LEFT JOIN worklist_items i ON w.id = i.worklist_id GROUP BY w.id HAVING COUNT(i.id) > 0",
      executionTime: "1,123ms",
      executionCount: 28934,
      avgTime: "1,123ms",
      cpuTime: "756ms",
      logicalReads: "21,345",
      database: "wms_production",
    },
    {
      id: 6,
      query: "DELETE FROM temp_processing WHERE created_at < NOW() - INTERVAL '24 hours'",
      executionTime: "934ms",
      executionCount: 1440,
      avgTime: "934ms",
      cpuTime: "623ms",
      logicalReads: "16,789",
      database: "wms_production",
    },
    {
      id: 7,
      query: "SELECT p.*, SUM(i.quantity) as total_qty FROM products p JOIN inventory i ON p.id = i.product_id WHERE p.category = $1 GROUP BY p.id",
      executionTime: "812ms",
      executionCount: 9876,
      avgTime: "812ms",
      cpuTime: "534ms",
      logicalReads: "13,456",
      database: "wms_production",
    },
    {
      id: 8,
      query: "UPDATE order_status SET status = 'COMPLETED', completed_at = NOW() WHERE order_id = $1 AND status = 'PROCESSING'",
      executionTime: "723ms",
      executionCount: 51234,
      avgTime: "723ms",
      cpuTime: "456ms",
      logicalReads: "10,234",
      database: "wms_production",
    },
    {
      id: 9,
      query: "SELECT DISTINCT location_id, zone FROM storage_locations WHERE available_capacity > $1 ORDER BY zone, location_id",
      executionTime: "612ms",
      executionCount: 13456,
      avgTime: "612ms",
      cpuTime: "398ms",
      logicalReads: "9,123",
      database: "wms_production",
    },
    {
      id: 10,
      query: "SELECT * FROM event_log WHERE event_type = 'ERROR' AND created_at > NOW() - INTERVAL '1 hour' ORDER BY created_at DESC LIMIT 100",
      executionTime: "521ms",
      executionCount: 37894,
      avgTime: "521ms",
      cpuTime: "334ms",
      logicalReads: "6,789",
      database: "wms_production",
    },
  ];

  const mongoQueries = [
    {
      id: 1,
      query: "db.orders.aggregate([{ $lookup: { from: 'customers', localField: 'customer_id', foreignField: '_id', as: 'customer' } }, { $match: { created_at: { $gte: new Date(Date.now() - 30*24*60*60*1000) } } }])",
      executionTime: "3,234ms",
      executionCount: 18945,
      avgTime: "3,234ms",
      cpuTime: "2,456ms",
      logicalReads: "67,891",
      database: "wms_production",
    },
    {
      id: 2,
      query: "db.inventory.updateOne({ sku: sku, location_id: locId }, { $inc: { quantity: -qty }, $set: { last_updated: new Date() } })",
      executionTime: "2,678ms",
      executionCount: 123456,
      avgTime: "2,678ms",
      cpuTime: "1,890ms",
      logicalReads: "51,234",
      database: "wms_production",
    },
    {
      id: 3,
      query: "db.transaction_history.find({ warehouse_id: { $in: warehouseIds }, region: 'WEST' }).sort({ transaction_date: -1 }).limit(1000)",
      executionTime: "2,345ms",
      executionCount: 8765,
      avgTime: "2,345ms",
      cpuTime: "1,678ms",
      logicalReads: "43,567",
      database: "wms_production",
    },
    {
      id: 4,
      query: "db.audit_log.insertOne({ user_id: uid, action: action, entity_type: type, entity_id: eid, timestamp: new Date(), details: details })",
      executionTime: "1,987ms",
      executionCount: 234567,
      avgTime: "1,987ms",
      cpuTime: "1,234ms",
      logicalReads: "35,678",
      database: "wms_production",
    },
    {
      id: 5,
      query: "db.worklists.aggregate([{ $lookup: { from: 'worklist_items', localField: '_id', foreignField: 'worklist_id', as: 'items' } }, { $match: { 'items.0': { $exists: true } } }])",
      executionTime: "1,765ms",
      executionCount: 34567,
      avgTime: "1,765ms",
      cpuTime: "1,123ms",
      logicalReads: "28,945",
      database: "wms_production",
    },
    {
      id: 6,
      query: "db.temp_processing.deleteMany({ created_at: { $lt: new Date(Date.now() - 24*60*60*1000) } })",
      executionTime: "1,456ms",
      executionCount: 1440,
      avgTime: "1,456ms",
      cpuTime: "934ms",
      logicalReads: "22,345",
      database: "wms_production",
    },
    {
      id: 7,
      query: "db.products.aggregate([{ $lookup: { from: 'inventory', localField: '_id', foreignField: 'product_id', as: 'inventory' } }, { $match: { category: cat } }, { $group: { _id: '$_id', total_qty: { $sum: '$inventory.quantity' } } }])",
      executionTime: "1,234ms",
      executionCount: 12345,
      avgTime: "1,234ms",
      cpuTime: "789ms",
      logicalReads: "18,234",
      database: "wms_production",
    },
    {
      id: 8,
      query: "db.order_status.updateOne({ order_id: oid, status: 'PROCESSING' }, { $set: { status: 'COMPLETED', completed_at: new Date() } })",
      executionTime: "1,098ms",
      executionCount: 67890,
      avgTime: "1,098ms",
      cpuTime: "678ms",
      logicalReads: "14,567",
      database: "wms_production",
    },
    {
      id: 9,
      query: "db.storage_locations.distinct('location_id', { available_capacity: { $gt: minCapacity } }).sort({ zone: 1, location_id: 1 })",
      executionTime: "987ms",
      executionCount: 15678,
      avgTime: "987ms",
      cpuTime: "589ms",
      logicalReads: "11,234",
      database: "wms_production",
    },
    {
      id: 10,
      query: "db.event_log.find({ event_type: 'ERROR', created_at: { $gte: new Date(Date.now() - 60*60*1000) } }).sort({ created_at: -1 }).limit(100)",
      executionTime: "876ms",
      executionCount: 45678,
      avgTime: "876ms",
      cpuTime: "512ms",
      logicalReads: "8,945",
      database: "wms_production",
    },
  ];

  if (dbName === "SQL Server") return sqlServerQueries;
  if (dbName === "PostgreSQL") return postgresQueries;
  return mongoQueries;
};

// Mock frequent queries
const getFrequentQueries = (dbName: string, dbType: string) => {
  const sqlServerQueries = [
    {
      id: 1,
      query: "INSERT INTO audit_log (user_id, action, entity_type, entity_id, timestamp, details) VALUES (@uid, @action, @type, @eid, GETDATE(), @details)",
      executionTime: "1,456ms",
      executionCount: 156789,
      avgTime: "9ms",
      cpuTime: "892ms",
      logicalReads: "23,456",
      database: "WMS_Production",
    },
    {
      id: 2,
      query: "UPDATE inventory SET quantity = quantity - @qty, last_updated = GETDATE() WHERE sku = @sku AND location_id = @loc",
      executionTime: "1,923ms",
      executionCount: 89234,
      avgTime: "22ms",
      cpuTime: "1,456ms",
      logicalReads: "34,521",
      database: "WMS_Production",
    },
    {
      id: 3,
      query: "UPDATE order_status SET status = 'COMPLETED', completed_at = GETDATE() WHERE order_id = @oid AND status = 'PROCESSING'",
      executionTime: "765ms",
      executionCount: 45678,
      avgTime: "17ms",
      cpuTime: "489ms",
      logicalReads: "9,876",
      database: "WMS_Production",
    },
    {
      id: 4,
      query: "SELECT TOP 100 * FROM event_log WHERE event_type = 'ERROR' AND created_at > DATEADD(hour, -1, GETDATE()) ORDER BY created_at DESC",
      executionTime: "543ms",
      executionCount: 34567,
      avgTime: "16ms",
      cpuTime: "356ms",
      logicalReads: "6,543",
      database: "WMS_Production",
    },
    {
      id: 5,
      query: "SELECT w.*, COUNT(i.id) as item_count FROM worklists w LEFT JOIN worklist_items i ON w.id = i.worklist_id GROUP BY w.id HAVING COUNT(i.id) > 0",
      executionTime: "1,234ms",
      executionCount: 23456,
      avgTime: "53ms",
      cpuTime: "845ms",
      logicalReads: "19,872",
      database: "WMS_Production",
    },
    {
      id: 6,
      query: "SELECT o.*, c.customer_name, p.* FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id WHERE o.created_at > DATEADD(day, -30, GETDATE())",
      executionTime: "2,847ms",
      executionCount: 12456,
      avgTime: "229ms",
      cpuTime: "1,923ms",
      logicalReads: "45,678",
      database: "WMS_Production",
    },
    {
      id: 7,
      query: "SELECT DISTINCT location_id, zone FROM storage_locations WHERE available_capacity > @min_capacity ORDER BY zone, location_id",
      executionTime: "654ms",
      executionCount: 12345,
      avgTime: "53ms",
      cpuTime: "423ms",
      logicalReads: "8,765",
      database: "WMS_Production",
    },
    {
      id: 8,
      query: "SELECT p.*, SUM(i.quantity) as total_qty FROM products p JOIN inventory i ON p.id = i.product_id WHERE p.category = @cat GROUP BY p.id",
      executionTime: "876ms",
      executionCount: 8934,
      avgTime: "98ms",
      cpuTime: "567ms",
      logicalReads: "12,345",
      database: "WMS_Production",
    },
    {
      id: 9,
      query: "SELECT * FROM transaction_history WHERE warehouse_id IN (SELECT id FROM warehouses WHERE region = 'WEST') ORDER BY transaction_date DESC",
      executionTime: "1,654ms",
      executionCount: 5678,
      avgTime: "291ms",
      cpuTime: "1,234ms",
      logicalReads: "28,934",
      database: "WMS_Production",
    },
    {
      id: 10,
      query: "DELETE FROM temp_processing WHERE created_at < DATEADD(hour, -24, GETDATE())",
      executionTime: "987ms",
      executionCount: 1440,
      avgTime: "685ms",
      cpuTime: "654ms",
      logicalReads: "15,234",
      database: "WMS_Production",
    },
  ];

  const postgresQueries = [
    {
      id: 1,
      query: "INSERT INTO audit_log (user_id, action, entity_type, entity_id, timestamp, details) VALUES ($1, $2, $3, $4, NOW(), $5)",
      executionTime: "1,345ms",
      executionCount: 178945,
      avgTime: "8ms",
      cpuTime: "823ms",
      logicalReads: "25,678",
      database: "wms_production",
    },
    {
      id: 2,
      query: "UPDATE inventory SET quantity = quantity - $1, last_updated = NOW() WHERE sku = $2 AND location_id = $3",
      executionTime: "1,789ms",
      executionCount: 98765,
      avgTime: "18ms",
      cpuTime: "1,234ms",
      logicalReads: "38,765",
      database: "wms_production",
    },
    {
      id: 3,
      query: "UPDATE order_status SET status = 'COMPLETED', completed_at = NOW() WHERE order_id = $1 AND status = 'PROCESSING'",
      executionTime: "723ms",
      executionCount: 51234,
      avgTime: "14ms",
      cpuTime: "456ms",
      logicalReads: "10,234",
      database: "wms_production",
    },
    {
      id: 4,
      query: "SELECT * FROM event_log WHERE event_type = 'ERROR' AND created_at > NOW() - INTERVAL '1 hour' ORDER BY created_at DESC LIMIT 100",
      executionTime: "521ms",
      executionCount: 37894,
      avgTime: "14ms",
      cpuTime: "334ms",
      logicalReads: "6,789",
      database: "wms_production",
    },
    {
      id: 5,
      query: "SELECT w.*, COUNT(i.id) as item_count FROM worklists w LEFT JOIN worklist_items i ON w.id = i.worklist_id GROUP BY w.id HAVING COUNT(i.id) > 0",
      executionTime: "1,123ms",
      executionCount: 28934,
      avgTime: "39ms",
      cpuTime: "756ms",
      logicalReads: "21,345",
      database: "wms_production",
    },
    {
      id: 6,
      query: "SELECT o.*, c.customer_name, p.* FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id WHERE o.created_at > NOW() - INTERVAL '30 days'",
      executionTime: "2,124ms",
      executionCount: 15678,
      avgTime: "135ms",
      cpuTime: "1,678ms",
      logicalReads: "52,341",
      database: "wms_production",
    },
    {
      id: 7,
      query: "SELECT DISTINCT location_id, zone FROM storage_locations WHERE available_capacity > $1 ORDER BY zone, location_id",
      executionTime: "612ms",
      executionCount: 13456,
      avgTime: "45ms",
      cpuTime: "398ms",
      logicalReads: "9,123",
      database: "wms_production",
    },
    {
      id: 8,
      query: "SELECT p.*, SUM(i.quantity) as total_qty FROM products p JOIN inventory i ON p.id = i.product_id WHERE p.category = $1 GROUP BY p.id",
      executionTime: "812ms",
      executionCount: 9876,
      avgTime: "82ms",
      cpuTime: "534ms",
      logicalReads: "13,456",
      database: "wms_production",
    },
    {
      id: 9,
      query: "SELECT * FROM transaction_history WHERE warehouse_id IN (SELECT id FROM warehouses WHERE region = 'WEST') ORDER BY transaction_date DESC LIMIT 1000",
      executionTime: "1,567ms",
      executionCount: 6789,
      avgTime: "231ms",
      cpuTime: "1,123ms",
      logicalReads: "31,234",
      database: "wms_production",
    },
    {
      id: 10,
      query: "DELETE FROM temp_processing WHERE created_at < NOW() - INTERVAL '24 hours'",
      executionTime: "934ms",
      executionCount: 1440,
      avgTime: "648ms",
      cpuTime: "623ms",
      logicalReads: "16,789",
      database: "wms_production",
    },
  ];

  const mongoQueries = [
    {
      id: 1,
      query: "db.audit_log.insertOne({ user_id: uid, action: action, entity_type: type, entity_id: eid, timestamp: new Date(), details: details })",
      executionTime: "1,987ms",
      executionCount: 234567,
      avgTime: "8ms",
      cpuTime: "1,234ms",
      logicalReads: "35,678",
      database: "wms_production",
    },
    {
      id: 2,
      query: "db.inventory.updateOne({ sku: sku, location_id: locId }, { $inc: { quantity: -qty }, $set: { last_updated: new Date() } })",
      executionTime: "2,678ms",
      executionCount: 123456,
      avgTime: "22ms",
      cpuTime: "1,890ms",
      logicalReads: "51,234",
      database: "wms_production",
    },
    {
      id: 3,
      query: "db.order_status.updateOne({ order_id: oid, status: 'PROCESSING' }, { $set: { status: 'COMPLETED', completed_at: new Date() } })",
      executionTime: "1,098ms",
      executionCount: 67890,
      avgTime: "16ms",
      cpuTime: "678ms",
      logicalReads: "14,567",
      database: "wms_production",
    },
    {
      id: 4,
      query: "db.event_log.find({ event_type: 'ERROR', created_at: { $gte: new Date(Date.now() - 60*60*1000) } }).sort({ created_at: -1 }).limit(100)",
      executionTime: "876ms",
      executionCount: 45678,
      avgTime: "19ms",
      cpuTime: "512ms",
      logicalReads: "8,945",
      database: "wms_production",
    },
    {
      id: 5,
      query: "db.worklists.aggregate([{ $lookup: { from: 'worklist_items', localField: '_id', foreignField: 'worklist_id', as: 'items' } }, { $match: { 'items.0': { $exists: true } } }])",
      executionTime: "1,765ms",
      executionCount: 34567,
      avgTime: "51ms",
      cpuTime: "1,123ms",
      logicalReads: "28,945",
      database: "wms_production",
    },
    {
      id: 6,
      query: "db.orders.aggregate([{ $lookup: { from: 'customers', localField: 'customer_id', foreignField: '_id', as: 'customer' } }, { $match: { created_at: { $gte: new Date(Date.now() - 30*24*60*60*1000) } } }])",
      executionTime: "3,234ms",
      executionCount: 18945,
      avgTime: "171ms",
      cpuTime: "2,456ms",
      logicalReads: "67,891",
      database: "wms_production",
    },
    {
      id: 7,
      query: "db.storage_locations.distinct('location_id', { available_capacity: { $gt: minCapacity } }).sort({ zone: 1, location_id: 1 })",
      executionTime: "987ms",
      executionCount: 15678,
      avgTime: "63ms",
      cpuTime: "589ms",
      logicalReads: "11,234",
      database: "wms_production",
    },
    {
      id: 8,
      query: "db.products.aggregate([{ $lookup: { from: 'inventory', localField: '_id', foreignField: 'product_id', as: 'inventory' } }, { $match: { category: cat } }, { $group: { _id: '$_id', total_qty: { $sum: '$inventory.quantity' } } }])",
      executionTime: "1,234ms",
      executionCount: 12345,
      avgTime: "100ms",
      cpuTime: "789ms",
      logicalReads: "18,234",
      database: "wms_production",
    },
    {
      id: 9,
      query: "db.transaction_history.find({ warehouse_id: { $in: warehouseIds }, region: 'WEST' }).sort({ transaction_date: -1 }).limit(1000)",
      executionTime: "2,345ms",
      executionCount: 8765,
      avgTime: "267ms",
      cpuTime: "1,678ms",
      logicalReads: "43,567",
      database: "wms_production",
    },
    {
      id: 10,
      query: "db.temp_processing.deleteMany({ created_at: { $lt: new Date(Date.now() - 24*60*60*1000) } })",
      executionTime: "1,456ms",
      executionCount: 1440,
      avgTime: "1,011ms",
      cpuTime: "934ms",
      logicalReads: "22,345",
      database: "wms_production",
    },
  ];

  if (dbName === "SQL Server") return sqlServerQueries;
  if (dbName === "PostgreSQL") return postgresQueries;
  return mongoQueries;
};

// Mock storage metrics for databases
const getStorageMetrics = (dbType: string) => {
  const isProd = dbType === "Production";
  
  return [
    {
      name: "Access",
      size: isProd ? "24.5 GB" : "8.2 GB",
      used: isProd ? "18.7 GB" : "6.1 GB",
      unused: isProd ? "5.8 GB" : "2.1 GB",
      growthRate: isProd ? "+450 MB/week" : "+120 MB/week",
      fileGrowth: "512 MB",
      tables: [
        { name: "user_sessions", size: isProd ? "4.2 GB" : "1.4 GB" },
        { name: "access_logs", size: isProd ? "3.8 GB" : "1.2 GB" },
        { name: "permissions", size: isProd ? "2.1 GB" : "0.7 GB" },
        { name: "auth_tokens", size: isProd ? "1.9 GB" : "0.6 GB" },
        { name: "user_profiles", size: isProd ? "1.7 GB" : "0.5 GB" },
        { name: "audit_trail", size: isProd ? "5.0 GB" : "1.7 GB" },
      ],
    },
    {
      name: "WESCore",
      size: isProd ? "68.3 GB" : "22.1 GB",
      used: isProd ? "58.9 GB" : "18.4 GB",
      unused: isProd ? "9.4 GB" : "3.7 GB",
      growthRate: isProd ? "+1.2 GB/week" : "+380 MB/week",
      fileGrowth: "1 GB",
      tables: [
        { name: "work_orders", size: isProd ? "12.4 GB" : "4.1 GB" },
        { name: "inventory_transactions", size: isProd ? "15.8 GB" : "5.2 GB" },
        { name: "locations", size: isProd ? "8.7 GB" : "2.9 GB" },
        { name: "products", size: isProd ? "6.2 GB" : "2.0 GB" },
        { name: "shipments", size: isProd ? "9.5 GB" : "3.1 GB" },
        { name: "order_headers", size: isProd ? "6.3 GB" : "2.1 GB" },
      ],
    },
    {
      name: "Scan",
      size: isProd ? "15.7 GB" : "5.3 GB",
      used: isProd ? "12.1 GB" : "4.2 GB",
      unused: isProd ? "3.6 GB" : "1.1 GB",
      growthRate: isProd ? "+320 MB/week" : "+95 MB/week",
      fileGrowth: "256 MB",
      tables: [
        { name: "scan_events", size: isProd ? "5.4 GB" : "1.8 GB" },
        { name: "barcode_history", size: isProd ? "3.2 GB" : "1.1 GB" },
        { name: "scan_validation", size: isProd ? "2.1 GB" : "0.7 GB" },
        { name: "device_logs", size: isProd ? "1.4 GB" : "0.6 GB" },
      ],
    },
    {
      name: "AutoStore",
      size: isProd ? "42.8 GB" : "14.2 GB",
      used: isProd ? "36.5 GB" : "11.9 GB",
      unused: isProd ? "6.3 GB" : "2.3 GB",
      growthRate: isProd ? "+890 MB/week" : "+280 MB/week",
      fileGrowth: "512 MB",
      tables: [
        { name: "bin_locations", size: isProd ? "8.9 GB" : "2.9 GB" },
        { name: "robot_tasks", size: isProd ? "11.2 GB" : "3.7 GB" },
        { name: "inventory_grid", size: isProd ? "9.4 GB" : "3.1 GB" },
        { name: "pick_missions", size: isProd ? "7.0 GB" : "2.3 GB" },
      ],
    },
    {
      name: "Configuration",
      size: isProd ? "8.4 GB" : "2.8 GB",
      used: isProd ? "6.7 GB" : "2.2 GB",
      unused: isProd ? "1.7 GB" : "0.6 GB",
      growthRate: isProd ? "+125 MB/week" : "+40 MB/week",
      fileGrowth: "128 MB",
      tables: [
        { name: "system_config", size: isProd ? "1.8 GB" : "0.6 GB" },
        { name: "user_preferences", size: isProd ? "1.2 GB" : "0.4 GB" },
        { name: "workflow_templates", size: isProd ? "2.1 GB" : "0.7 GB" },
        { name: "integration_settings", size: isProd ? "1.6 GB" : "0.5 GB" },
      ],
    },
    {
      name: "Route",
      size: isProd ? "31.2 GB" : "10.4 GB",
      used: isProd ? "26.8 GB" : "8.9 GB",
      unused: isProd ? "4.4 GB" : "1.5 GB",
      growthRate: isProd ? "+670 MB/week" : "+215 MB/week",
      fileGrowth: "512 MB",
      tables: [
        { name: "route_plans", size: isProd ? "7.8 GB" : "2.6 GB" },
        { name: "route_history", size: isProd ? "9.2 GB" : "3.1 GB" },
        { name: "waypoints", size: isProd ? "5.4 GB" : "1.8 GB" },
        { name: "optimization_cache", size: isProd ? "4.4 GB" : "1.4 GB" },
      ],
    },
    {
      name: "GTP",
      size: isProd ? "19.6 GB" : "6.5 GB",
      used: isProd ? "15.9 GB" : "5.3 GB",
      unused: isProd ? "3.7 GB" : "1.2 GB",
      growthRate: isProd ? "+410 MB/week" : "+130 MB/week",
      fileGrowth: "256 MB",
      tables: [
        { name: "gtp_transactions", size: isProd ? "6.7 GB" : "2.2 GB" },
        { name: "processing_queue", size: isProd ? "4.3 GB" : "1.4 GB" },
        { name: "gtp_config", size: isProd ? "2.1 GB" : "0.7 GB" },
        { name: "error_logs", size: isProd ? "2.8 GB" : "1.0 GB" },
      ],
    },
  ];
};

// Mock RabbitMQ queue data
const getRabbitMQQueues = (dbType: string) => {
  const isProd = dbType === "Production";
  
  return [
    {
      name: "wms.orders.incoming",
      messagesReady: isProd ? 1247 : 42,
      messagesUnacknowledged: isProd ? 38 : 3,
      totalMessages: isProd ? 1285 : 45,
      publishRate: isProd ? "42/s" : "3/s",
      deliveryRate: isProd ? "38/s" : "2.8/s",
      consumers: isProd ? 5 : 2,
      state: "running",
    },
    {
      name: "wms.inventory.updates",
      messagesReady: isProd ? 3842 : 127,
      messagesUnacknowledged: isProd ? 156 : 8,
      totalMessages: isProd ? 3998 : 135,
      publishRate: isProd ? "128/s" : "9/s",
      deliveryRate: isProd ? "124/s" : "8.5/s",
      consumers: isProd ? 8 : 3,
      state: "running",
    },
    {
      name: "wms.shipments.outbound",
      messagesReady: isProd ? 892 : 28,
      messagesUnacknowledged: isProd ? 24 : 2,
      totalMessages: isProd ? 916 : 30,
      publishRate: isProd ? "31/s" : "2/s",
      deliveryRate: isProd ? "29/s" : "1.8/s",
      consumers: isProd ? 4 : 1,
      state: "running",
    },
    {
      name: "wms.picking.tasks",
      messagesReady: isProd ? 5634 : 214,
      messagesUnacknowledged: isProd ? 287 : 12,
      totalMessages: isProd ? 5921 : 226,
      publishRate: isProd ? "184/s" : "14/s",
      deliveryRate: isProd ? "178/s" : "13.5/s",
      consumers: isProd ? 12 : 4,
      state: "running",
    },
    {
      name: "wms.replenishment.queue",
      messagesReady: isProd ? 1456 : 67,
      messagesUnacknowledged: isProd ? 43 : 4,
      totalMessages: isProd ? 1499 : 71,
      publishRate: isProd ? "52/s" : "4/s",
      deliveryRate: isProd ? "48/s" : "3.8/s",
      consumers: isProd ? 6 : 2,
      state: "running",
    },
    {
      name: "wms.returns.processing",
      messagesReady: isProd ? 234 : 12,
      messagesUnacknowledged: isProd ? 8 : 1,
      totalMessages: isProd ? 242 : 13,
      publishRate: isProd ? "8/s" : "0.5/s",
      deliveryRate: isProd ? "7.5/s" : "0.4/s",
      consumers: isProd ? 2 : 1,
      state: "running",
    },
    {
      name: "wms.autostore.commands",
      messagesReady: isProd ? 2187 : 89,
      messagesUnacknowledged: isProd ? 94 : 5,
      totalMessages: isProd ? 2281 : 94,
      publishRate: isProd ? "78/s" : "5.5/s",
      deliveryRate: isProd ? "74/s" : "5.2/s",
      consumers: isProd ? 10 : 3,
      state: "running",
    },
    {
      name: "wms.notifications.alerts",
      messagesReady: isProd ? 67 : 3,
      messagesUnacknowledged: isProd ? 4 : 0,
      totalMessages: isProd ? 71 : 3,
      publishRate: isProd ? "12/s" : "0.8/s",
      deliveryRate: isProd ? "11/s" : "0.7/s",
      consumers: isProd ? 3 : 1,
      state: "running",
    },
    {
      name: "wms.audit.events",
      messagesReady: isProd ? 4567 : 178,
      messagesUnacknowledged: isProd ? 123 : 7,
      totalMessages: isProd ? 4690 : 185,
      publishRate: isProd ? "156/s" : "11/s",
      deliveryRate: isProd ? "152/s" : "10.5/s",
      consumers: isProd ? 4 : 2,
      state: "running",
    },
    {
      name: "wms.errors.deadletter",
      messagesReady: isProd ? 18 : 2,
      messagesUnacknowledged: isProd ? 0 : 0,
      totalMessages: isProd ? 18 : 2,
      publishRate: isProd ? "0.2/s" : "0.01/s",
      deliveryRate: isProd ? "0/s" : "0/s",
      consumers: isProd ? 0 : 0,
      state: "idle",
    },
  ];
};

// Mock database events (Deadlocks, etc.)
const getDatabaseEvents = (dbName: string, dbType: string, dataType: string) => {
  const isProd = dbType === "Production";
  const dataTypeKey = dataType === "SQL" ? "SQL Server" : dataType;
  
  // Only SQL Server, PostgreSQL, MongoDB, and RabbitMQ have events
  if (dataTypeKey !== "SQL Server" && dataTypeKey !== "PostgreSQL" && dataTypeKey !== "MongoDB" && dataTypeKey !== "RabbitMQ") {
    return [];
  }

  if (dataTypeKey === "SQL Server") {
    if (isProd) {
      return [
        {
          id: 1,
          type: "Deadlock",
          severity: "High",
          timestamp: "2026-03-18 09:23:14",
          database: "WMS_Production",
          description: "Deadlock detected between UPDATE on inventory table and SELECT on order_items table",
          victim: "SPID 342",
          details: "Process SPID 342 was chosen as deadlock victim. Query: UPDATE inventory SET quantity = quantity - 5 WHERE sku = 'ABC-123'",
          resolution: "Transaction rolled back automatically",
        },
        {
          id: 2,
          type: "Deadlock",
          severity: "High",
          timestamp: "2026-03-18 07:15:42",
          database: "WMS_Production",
          description: "Deadlock on worklist_items table during concurrent update operations",
          victim: "SPID 289",
          details: "Process SPID 289 holding lock on worklist_items conflicted with SPID 301",
          resolution: "Transaction rolled back automatically",
        },
        {
          id: 3,
          type: "Deadlock",
          severity: "Medium",
          timestamp: "2026-03-17 22:48:19",
          database: "WMS_Production",
          description: "Deadlock between batch processing job and real-time inventory update",
          victim: "SPID 456",
          details: "Batch update process conflicted with real-time inventory adjustment",
          resolution: "Transaction rolled back and retried successfully",
        },
        {
          id: 4,
          type: "Primary Key Violation",
          severity: "High",
          timestamp: "2026-03-18 14:07:32",
          database: "WMS_Production",
          description: "Attempted to insert duplicate primary key in orders table",
          details: "Violation of PRIMARY KEY constraint 'PK_Orders'. Cannot insert duplicate key in object 'dbo.orders'. The duplicate key value is (ORD-2024-08764).",
          resolution: "Insert operation failed and rolled back. Application layer regenerated unique order ID.",
        },
        {
          id: 5,
          type: "Data Type Mismatch",
          severity: "Medium",
          timestamp: "2026-03-18 11:42:18",
          database: "WMS_Production",
          description: "Invalid data type conversion during bulk insert operation",
          details: "Error converting data type varchar to numeric. Column: 'quantity', Table: 'inventory_adjustments', Value: 'N/A'",
          resolution: "Bulk insert halted. Data validation rules updated to sanitize input before insertion.",
        },
        {
          id: 6,
          type: "Query Timeout",
          severity: "Medium",
          timestamp: "2026-03-18 08:55:47",
          database: "WMS_Production",
          description: "Long-running analytics query exceeded timeout threshold",
          details: "Timeout expired. The timeout period elapsed prior to completion of the operation. Query: SELECT * FROM transaction_history th INNER JOIN order_details od ON th.order_id = od.id WHERE th.created_at >= '2025-01-01'",
          resolution: "Query terminated after 300 seconds. Added missing index on transaction_history.created_at column.",
        },
        {
          id: 7,
          type: "Query Timeout",
          severity: "Low",
          timestamp: "2026-03-17 16:23:11",
          database: "WMS_Production",
          description: "Report generation query exceeded execution time limit",
          details: "Query execution time of 185 seconds exceeded the configured limit of 180 seconds for report queries. Query: Complex aggregation on shipment_tracking table.",
          resolution: "Query cancelled. Report parameters adjusted to reduce date range and improve performance.",
        },
      ];
    } else {
      // Sandbox has fewer events
      return [
        {
          id: 1,
          type: "Deadlock",
          severity: "Low",
          timestamp: "2026-03-17 14:22:08",
          database: "WMS_Sandbox",
          description: "Test deadlock during load testing scenario",
          victim: "SPID 102",
          details: "Simulated deadlock during concurrent test execution",
          resolution: "Transaction rolled back automatically",
        },
        {
          id: 2,
          type: "Primary Key Violation",
          severity: "Low",
          timestamp: "2026-03-17 10:15:33",
          database: "WMS_Sandbox",
          description: "Test case validating primary key constraint enforcement",
          details: "Violation of PRIMARY KEY constraint 'PK_TestOrders'. Duplicate key value is (TEST-001).",
          resolution: "Expected test failure. Constraint validation working as designed.",
        },
        {
          id: 3,
          type: "Data Type Mismatch",
          severity: "Low",
          timestamp: "2026-03-16 13:47:22",
          database: "WMS_Sandbox",
          description: "Test data import with intentional type mismatch",
          details: "Error converting data type nvarchar to int. Column: 'warehouse_id', Value: 'WAREHOUSE-A'",
          resolution: "Test case passed. Data validation logic confirmed working correctly.",
        },
      ];
    }
  }

  if (dataTypeKey === "PostgreSQL") {
    if (isProd) {
      return [
        {
          id: 1,
          type: "Deadlock",
          severity: "High",
          timestamp: "2026-03-18 11:42:33",
          database: "wms_analytics",
          description: "Deadlock detected during concurrent reporting queries",
          victim: "PID 8934",
          details: "Process 8934 deadlocked with process 8956 on analytics_summary table",
          resolution: "ERROR: deadlock detected - transaction aborted",
        },
        {
          id: 2,
          type: "Deadlock",
          severity: "Medium",
          timestamp: "2026-03-17 19:12:55",
          database: "wms_analytics",
          description: "Deadlock during ETL process and manual query execution",
          victim: "PID 7823",
          details: "ETL process conflicted with ad-hoc reporting query",
          resolution: "ERROR: deadlock detected - transaction aborted and retried",
        },
        {
          id: 3,
          type: "Primary Key Violation",
          severity: "High",
          timestamp: "2026-03-18 13:28:45",
          database: "wms_analytics",
          description: "Duplicate key value violates unique constraint on metrics table",
          details: "ERROR: duplicate key value violates unique constraint 'daily_metrics_pkey'. Key (metric_date, warehouse_id)=(2026-03-18, WH-001) already exists.",
          resolution: "INSERT operation failed. Application updated to use UPSERT pattern with ON CONFLICT clause.",
        },
        {
          id: 4,
          type: "Data Type Mismatch",
          severity: "Medium",
          timestamp: "2026-03-18 10:16:29",
          database: "wms_analytics",
          description: "Invalid input syntax for type during data migration",
          details: "ERROR: invalid input syntax for type integer: 'NULL_VALUE'. Column: 'item_count', Table: 'order_summary'",
          resolution: "Migration script updated to handle NULL strings properly. Affected rows re-processed.",
        },
        {
          id: 5,
          type: "Query Timeout",
          severity: "Medium",
          timestamp: "2026-03-18 09:03:12",
          database: "wms_analytics",
          description: "Complex analytical query exceeded statement timeout",
          details: "ERROR: canceling statement due to statement timeout. Query: SELECT warehouse_id, date_trunc('hour', created_at), COUNT(*) FROM orders WHERE created_at >= '2024-01-01' GROUP BY warehouse_id, date_trunc('hour', created_at)",
          resolution: "Query terminated after 600 seconds. Added composite index on (warehouse_id, created_at) and partitioned table by month.",
        },
        {
          id: 6,
          type: "Data Type Mismatch",
          severity: "Low",
          timestamp: "2026-03-17 14:52:37",
          database: "wms_analytics",
          description: "Type cast error in stored procedure execution",
          details: "ERROR: cannot cast type character varying to numeric. Expression attempted: CAST('TBD' AS NUMERIC(10,2))",
          resolution: "Stored procedure updated with proper type validation before casting. Default values implemented.",
        },
        {
          id: 7,
          type: "Query Timeout",
          severity: "Low",
          timestamp: "2026-03-16 22:41:09",
          database: "wms_analytics",
          description: "Scheduled report generation exceeded time limit",
          details: "Query exceeded configured timeout of 300 seconds during nightly batch processing. Query involved full table scan of historical_events (24M rows).",
          resolution: "Query optimized with incremental processing approach. Processing time reduced to 45 seconds.",
        },
      ];
    } else {
      return [
        {
          id: 1,
          type: "Primary Key Violation",
          severity: "Low",
          timestamp: "2026-03-17 11:34:19",
          database: "wms_analytics_sandbox",
          description: "Integration test validating duplicate prevention",
          details: "ERROR: duplicate key value violates unique constraint 'test_orders_pkey'. Key (order_id)=(TST-001) already exists.",
          resolution: "Test case passed. Unique constraint validation confirmed.",
        },
        {
          id: 2,
          type: "Data Type Mismatch",
          severity: "Low",
          timestamp: "2026-03-16 15:22:44",
          database: "wms_analytics_sandbox",
          description: "Development testing of input validation",
          details: "ERROR: invalid input syntax for type timestamp: '2026-99-99'. Column: 'shipment_date'",
          resolution: "Expected test failure. Input validation layer correctly rejecting invalid dates.",
        },
      ];
    }
  }

  if (dataTypeKey === "MongoDB") {
    if (isProd) {
      return [
        {
          id: 1,
          type: "Duplicate Key Error",
          severity: "High",
          timestamp: "2026-03-18 10:18:27",
          database: "wms_production",
          description: "Duplicate key error on unique index during order insertion",
          details: "E11000 duplicate key error collection: wms_production.orders index: order_number_1 dup key: { order_number: \"ORD-2026-15874\" }",
          resolution: "Write operation rejected. Application layer implemented retry logic with regenerated order number.",
        },
        {
          id: 2,
          type: "Document Validation Failure",
          severity: "Medium",
          timestamp: "2026-03-18 13:45:19",
          database: "wms_production",
          description: "Document failed schema validation on inventory collection",
          details: "Document failed validation. Error: { failingDocumentId: ObjectId('65f8a9c7d4e2b1a8c9f3d2e1'), details: { operatorName: '$jsonSchema', schemaRulesNotSatisfied: [{ operatorName: 'required', specifiedAs: { required: ['sku', 'quantity', 'location_id'] }, missingProperties: ['location_id'] }] } }",
          resolution: "Insert operation rejected. Data import process updated to validate all required fields before insertion.",
        },
        {
          id: 3,
          type: "Write Concern Timeout",
          severity: "High",
          timestamp: "2026-03-18 09:32:41",
          database: "wms_production",
          description: "Write operation failed to replicate within timeout period",
          details: "waiting for replication timed out; Error: { wtimeout: true, writeConcern: { w: 'majority', wtimeout: 5000 }, errInfo: { writeConcern: { w: 'majority', wtimeout: 5000, provenance: 'clientSupplied' } } }",
          resolution: "Write operation rolled back. Increased wtimeout to 10000ms and investigated secondary node lag (network latency detected).",
        },
        {
          id: 4,
          type: "Exceeded Memory Limit",
          severity: "High",
          timestamp: "2026-03-18 07:22:15",
          database: "wms_production",
          description: "Aggregation pipeline exceeded memory limit during analytics query",
          details: "Executor error during aggregation :: caused by :: Sort exceeded memory limit of 104857600 bytes, but did not opt in to external sorting. Query: db.transaction_history.aggregate([{ $match: { created_at: { $gte: ISODate('2024-01-01') } } }, { $sort: { amount: -1 } }, { $group: { _id: '$warehouse_id', total: { $sum: '$amount' } } }])",
          resolution: "Query failed. Added { allowDiskUse: true } option to aggregation pipeline and created index on (created_at, amount) fields.",
        },
        {
          id: 5,
          type: "Duplicate Key Error",
          severity: "Medium",
          timestamp: "2026-03-17 18:54:33",
          database: "wms_production",
          description: "Duplicate key during batch import of customer records",
          details: "E11000 duplicate key error collection: wms_production.customers index: email_1 dup key: { email: \"customer@example.com\" }",
          resolution: "Batch insert continued with other documents. Duplicate detection added to pre-processing step.",
        },
        {
          id: 6,
          type: "Document Validation Failure",
          severity: "Low",
          timestamp: "2026-03-17 15:11:08",
          database: "wms_production",
          description: "Invalid data type in shipment tracking update",
          details: "Document failed validation. Field 'estimated_delivery' expected type: date, received: string value '2026-03-99'",
          resolution: "Update operation rejected. Input validation enhanced to parse and validate date strings before database operations.",
        },
        {
          id: 7,
          type: "Exceeded Memory Limit",
          severity: "Medium",
          timestamp: "2026-03-16 23:47:52",
          database: "wms_production",
          description: "Large document scan exceeded working set memory",
          details: "PlanExecutor error during find command on collection 'audit_logs' :: caused by :: Working set size exceeded available memory. Query attempted to scan 2.4M documents without index support.",
          resolution: "Query cancelled. Created compound index on frequently queried fields (user_id, timestamp) reducing memory footprint by 87%.",
        },
      ];
    } else {
      return [
        {
          id: 1,
          type: "Duplicate Key Error",
          severity: "Low",
          timestamp: "2026-03-17 12:28:14",
          database: "wms_sandbox",
          description: "Test case validating unique index enforcement",
          details: "E11000 duplicate key error collection: wms_sandbox.test_collection index: test_id_1 dup key: { test_id: \"TEST-001\" }",
          resolution: "Expected test failure. Unique constraint validation confirmed working correctly.",
        },
        {
          id: 2,
          type: "Document Validation Failure",
          severity: "Low",
          timestamp: "2026-03-17 09:16:42",
          database: "wms_sandbox",
          description: "Schema validation test with missing required fields",
          details: "Document failed validation. Missing required fields: ['product_id', 'quantity']. Test document intentionally malformed.",
          resolution: "Test case passed. Schema validation rules working as designed.",
        },
        {
          id: 3,
          type: "Write Concern Timeout",
          severity: "Low",
          timestamp: "2026-03-16 14:33:27",
          database: "wms_sandbox",
          description: "Simulated replication delay during load testing",
          details: "Write concern timeout during stress test scenario. Configured wtimeout: 1000ms (artificially low for testing).",
          resolution: "Expected behavior during load test. Replication lag monitoring confirmed operational.",
        },
      ];
    }
  }

  if (dataTypeKey === "RabbitMQ") {
    if (isProd) {
      return [
        {
          id: 1,
          type: "Memory Alarm",
          severity: "High",
          timestamp: "2026-03-18 11:42:15",
          database: "wms_rabbitmq_prod",
          description: "Memory alarm triggered - broker reached high watermark threshold",
          details: "Memory alarm set. Memory usage: 1.89 GB / 2.00 GB (95%). High watermark: 0.4 (relative). All publishers blocked. Configured memory limit: vm_memory_high_watermark = 0.4",
          resolution: "Publishers blocked until memory recovered. Purged old messages from audit queue (127,453 messages). Increased VM memory limit to 4 GB and adjusted watermark to 0.5.",
        },
        {
          id: 2,
          type: "Disk Limit Alarm",
          severity: "High",
          timestamp: "2026-03-18 09:15:33",
          database: "wms_rabbitmq_prod",
          description: "Free disk space dropped below configured threshold",
          details: "Disk alarm set. Free disk space: 4.2 GB / 100 GB (4.2%). Threshold: disk_free_limit = 5 GB. All publishers blocked to prevent disk exhaustion. Affected queues: orders_queue, shipments_queue, notifications_queue",
          resolution: "Publishers blocked. Archived old persistent messages to S3 (2.8 GB recovered). Cleaned up log files (1.1 GB). Disk space restored to 12.3 GB. Alarm cleared automatically.",
        },
        {
          id: 3,
          type: "TCP Socket Limit",
          severity: "Medium",
          timestamp: "2026-03-18 14:27:48",
          database: "wms_rabbitmq_prod",
          description: "Maximum TCP connections limit reached",
          details: "Connection refused - file descriptor limit reached. Active connections: 1024 / 1024. Configuration: {tcp_listeners, [{\"0.0.0.0\", 5672}]}, {num_tcp_acceptors, 10}. Client error: 'connection refused (ECONNREFUSED)'",
          resolution: "New connections rejected temporarily. Identified 147 idle connections from legacy service and closed them. Increased file descriptor limit to 4096. Added connection pooling to client applications.",
        },
        {
          id: 4,
          type: "Memory Alarm",
          severity: "Medium",
          timestamp: "2026-03-17 22:38:21",
          database: "wms_rabbitmq_prod",
          description: "Memory usage approaching threshold during peak processing",
          details: "Memory usage: 1.58 GB / 2.00 GB (79%). Paging to disk increased. Queue memory: orders_queue (487 MB), shipments_queue (312 MB), events_queue (198 MB)",
          resolution: "Memory alarm not triggered but closely monitored. Enabled lazy queues on high-volume queues to reduce memory footprint. Messages moved to disk storage.",
        },
        {
          id: 5,
          type: "Disk Limit Alarm",
          severity: "Medium",
          timestamp: "2026-03-17 16:55:12",
          database: "wms_rabbitmq_prod",
          description: "Disk space usage increased due to message persistence",
          details: "Free disk space: 8.7 GB / 100 GB (8.7%). Approaching threshold. Persistent message size: 6.2 GB across all queues. Log files: 2.4 GB",
          resolution: "Implemented message TTL on non-critical queues. Set max-length on audit queues. Configured log rotation policy. Disk usage stabilized at 12 GB free.",
        },
        {
          id: 6,
          type: "TCP Socket Limit",
          severity: "High",
          timestamp: "2026-03-16 19:44:37",
          database: "wms_rabbitmq_prod",
          description: "Consumer connection spike exhausted available sockets",
          details: "TCP socket exhaustion during deployment. Connections: 1021 / 1024. Consumer reconnection storm detected from 23 microservices. Average connection rate: 47/second",
          resolution: "Connections throttled. Implemented exponential backoff in consumer reconnection logic. Coordinated rolling restart instead of simultaneous restart. Added connection health checks.",
        },
      ];
    } else {
      return [
        {
          id: 1,
          type: "Memory Alarm",
          severity: "Low",
          timestamp: "2026-03-17 10:22:14",
          database: "wms_rabbitmq_sandbox",
          description: "Load testing memory alarm simulation",
          details: "Memory alarm triggered intentionally during stress test. Memory usage: 950 MB / 1 GB (95%). Test scenario: 100K messages published simultaneously.",
          resolution: "Expected test behavior. Memory alarm functionality validated. Publishers blocked as designed. Alarm cleared after message consumption.",
        },
        {
          id: 2,
          type: "Disk Limit Alarm",
          severity: "Low",
          timestamp: "2026-03-16 15:47:29",
          database: "wms_rabbitmq_sandbox",
          description: "Disk limit threshold testing",
          details: "Disk alarm simulation with artificially low threshold (disk_free_limit = 1 GB). Free space: 800 MB. Testing alarm and recovery procedures.",
          resolution: "Test passed. Alarm triggered correctly. Publisher blocking confirmed. Recovery procedures documented.",
        },
        {
          id: 3,
          type: "TCP Socket Limit",
          severity: "Low",
          timestamp: "2026-03-15 13:18:55",
          database: "wms_rabbitmq_sandbox",
          description: "Connection limit test for capacity planning",
          details: "Simulated 500 concurrent connections to test scalability. File descriptor limit: 1024. Connection patterns analyzed for production sizing.",
          resolution: "Test completed successfully. Connection handling validated. Recommendations: 4096 FD limit for production based on projected load.",
        },
      ];
    }
  }

  return [];
};

export function DatabaseDetailPanel({ dbName, dbType, computerName, dataType, onClose }: DatabaseDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"details" | "storage" | "queries" | "events">("details");
  const [expandedDatabases, setExpandedDatabases] = useState<Set<string>>(new Set());
  const [queryFilter, setQueryFilter] = useState<"expensive" | "frequent">("expensive");
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set());
  const details = getDatabaseDetails(dbName, dbType, dataType);
  const queries = queryFilter === "expensive" ? getExpensiveQueries(dbName, dbType) : getFrequentQueries(dbName, dbType);
  const storageMetrics = getStorageMetrics(dbType);
  const rabbitMQQueues = getRabbitMQQueues(dbType);
  const events = getDatabaseEvents(dbName, dbType, dataType);
  const isRabbitMQ = dataType === "RabbitMQ";

  const toggleDatabaseExpansion = (dbName: string) => {
    const newExpanded = new Set(expandedDatabases);
    if (newExpanded.has(dbName)) {
      newExpanded.delete(dbName);
    } else {
      newExpanded.add(dbName);
    }
    setExpandedDatabases(newExpanded);
  };

  const toggleEventExpansion = (eventId: number) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[700px] bg-white dark:bg-zinc-900 border-l-2 border-zinc-300 dark:border-zinc-700 shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-zinc-100 dark:bg-zinc-800 border-b-2 border-zinc-300 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Database className="text-[#0d9488] dark:text-[#50e080]" size={24} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{computerName}</h2>
                <span className="text-lg font-medium text-zinc-500 dark:text-zinc-400">({dataType})</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{dbType} Environment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 dark:border-zinc-700">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("storage")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "storage"
                ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            {isRabbitMQ ? "Queues" : "Storage"}
          </button>
          {!isRabbitMQ && (
            <button
              onClick={() => setActiveTab("queries")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "queries"
                  ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Queries
            </button>
          )}
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "events"
                ? "border-[#0d9488] dark:border-[#50e080] text-zinc-900 dark:text-white"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Events
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "details" ? (
          <div className="space-y-6">
            {/* Connection Section */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b-2 border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Server size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Connection</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Host</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.connection.host}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Port</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.connection.port}</span>
                </div>
                {isRabbitMQ && (
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Management Port</span>
                    <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.connection as any).managementPort}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Status</span>
                  <span className="text-sm font-semibold text-green-500">{details.connection.status}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Uptime</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.connection.uptime}</span>
                </div>
              </div>
            </div>

            {/* Configuration Section */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b-2 border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Configuration</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Version</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.configuration.version}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Edition</span>
                  <span className="text-sm text-zinc-900 dark:text-white">{details.configuration.edition}</span>
                </div>
                {isRabbitMQ ? (
                  <>
                    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Erlang Version</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.configuration as any).erlangVersion}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Cluster Mode</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.configuration as any).clusterMode}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Character Set</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.configuration.charset}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Collation</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.configuration.collation}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Max Connections</span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">{details.configuration.maxConnections}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Current Connections</span>
                  <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{details.configuration.currentConnections}</span>
                </div>
              </div>
            </div>

            {/* Performance Section */}
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b-2 border-zinc-300 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white">Performance</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {isRabbitMQ ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Avg Latency</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.performance as any).avgLatency}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Messages/min</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.performance as any).messagesPerMin}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Publish Rate</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.performance as any).publishRate}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Delivery Rate</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.performance as any).deliveryRate}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Ack Rate</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.performance as any).ackRate}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Avg Query Time</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.performance as any).avgQueryTime}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Transactions</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.performance as any).transactions}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Cache Hit Ratio</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.performance as any).cacheHitRatio}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">I/O Throughput</span>
                      <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details.performance as any).ioThroughput}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Storage/Resources Section */}
            {isRabbitMQ ? (
              <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b-2 border-zinc-300 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <HardDrive size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                    <h3 className="font-semibold text-zinc-900 dark:text-white">Resources</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Memory Used</span>
                    <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{(details as any).resources.memoryUsed}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Memory Limit</span>
                    <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details as any).resources.memoryLimit}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Disk Free</span>
                    <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details as any).resources.diskFree}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">File Descriptors</span>
                    <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details as any).resources.fileDescriptors}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Socket Descriptors</span>
                    <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details as any).resources.socketDescriptors}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border-b-2 border-zinc-300 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <HardDrive size={20} className="text-[#0d9488] dark:text-[#50e080]" />
                    <h3 className="font-semibold text-zinc-900 dark:text-white">Storage</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Total Size</span>
                    <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{(details as any).storage.totalSize}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Data Size</span>
                    <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details as any).storage.dataSize}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Index Size</span>
                    <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details as any).storage.indexSize}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Log Size</span>
                    <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details as any).storage.logSize}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Growth Rate</span>
                    <span className="font-mono text-sm text-zinc-900 dark:text-white">{(details as any).storage.growth}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === "storage" ? (
          // Storage/Queues Tab
          <div className="space-y-4">
            <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <HardDrive size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {isRabbitMQ ? "Queue Metrics" : "Storage Metrics"} • <span className="font-semibold text-zinc-900 dark:text-white">{dbType} Environment</span>
                </p>
              </div>
            </div>

            {/* Storage List or Queue List */}
            {isRabbitMQ ? (
              <div className="space-y-3">
                {rabbitMQQueues.map((queue) => (
                  <div
                    key={queue.name}
                    className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Database size={16} className="text-[#0d9488] dark:text-[#50e080]" />
                          <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{queue.name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          queue.state === "running" 
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}>
                          {queue.state}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Messages Ready</div>
                          <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                            {queue.messagesReady.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Unacknowledged</div>
                          <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                            {queue.messagesUnacknowledged.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Total Messages</div>
                          <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                            {queue.totalMessages.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Consumers</div>
                          <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                            {queue.consumers}
                          </div>
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Publish Rate</div>
                          <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                            {queue.publishRate}
                          </div>
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Delivery Rate</div>
                          <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                            {queue.deliveryRate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {storageMetrics.map((db) => (
                <div
                  key={db.name}
                  className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden hover:border-[#0d9488] dark:hover:border-[#50e080] transition-colors"
                >
                  <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 border-b border-zinc-300 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0d9488]/20 dark:bg-[#50e080]/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#0d9488] dark:text-[#50e080]">{db.name}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <HardDrive size={16} className="text-orange-500" />
                          <span className="font-mono text-sm font-semibold text-orange-500">{db.size}</span>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{db.growthRate}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDatabaseExpansion(db.name)}
                      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      {expandedDatabases.has(db.name) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  
                  {expandedDatabases.has(db.name) && (
                    <div className="p-4 space-y-3">
                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Used</div>
                          <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{db.used}</div>
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Unused</div>
                          <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{db.unused}</div>
                        </div>
                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">File Growth</div>
                          <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{db.fileGrowth}</div>
                        </div>
                      </div>

                      {/* Tables List */}
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Tables</h4>
                        <div className="space-y-2">
                          {db.tables.map((table) => (
                            <div key={table.name} className="flex items-center justify-between">
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">{table.name}</span>
                              <span className="font-mono text-sm text-zinc-900 dark:text-white">{table.size}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              </div>
            )}
          </div>
        ) : activeTab === "queries" ? (
          // Queries Tab
          <div className="space-y-4">
            {/* Filter Tiles */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setQueryFilter("expensive")}
                className={`bg-white dark:bg-zinc-900 border-2 rounded-lg p-4 text-left transition-all hover:scale-105 ${
                  queryFilter === "expensive"
                    ? "border-[#0d9488] dark:border-[#50e080] bg-[#0d9488]/10 dark:bg-[#50e080]/10"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={18} className={queryFilter === "expensive" ? "text-[#0d9488] dark:text-[#50e080]" : "text-zinc-600 dark:text-zinc-400"} />
                  <span className={`text-sm font-semibold ${queryFilter === "expensive" ? "text-[#0d9488] dark:text-[#50e080]" : "text-zinc-600 dark:text-zinc-400"}`}>
                    Most Expensive
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Queries by execution time</p>
              </button>

              <button
                onClick={() => setQueryFilter("frequent")}
                className={`bg-white dark:bg-zinc-900 border-2 rounded-lg p-4 text-left transition-all hover:scale-105 ${
                  queryFilter === "frequent"
                    ? "border-[#0d9488] dark:border-[#50e080] bg-[#0d9488]/10 dark:bg-[#50e080]/10"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={18} className={queryFilter === "frequent" ? "text-[#0d9488] dark:text-[#50e080]" : "text-zinc-600 dark:text-zinc-400"} />
                  <span className={`text-sm font-semibold ${queryFilter === "frequent" ? "text-[#0d9488] dark:text-[#50e080]" : "text-zinc-600 dark:text-zinc-400"}`}>
                    Most Frequent
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Queries by execution count</p>
              </button>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {queryFilter === "expensive" ? "Top 10 queries by execution time" : "Top 10 queries by execution count"} • <span className="font-semibold text-zinc-900 dark:text-white">{dbType} Environment</span>
                </p>
              </div>
            </div>

            {/* Query List */}
            <div className="space-y-3">
              {queries.map((query, index) => (
                <div
                  key={query.id}
                  className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden hover:border-[#0d9488] dark:hover:border-[#50e080] transition-colors"
                >
                  <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 border-b border-zinc-300 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0d9488]/20 dark:bg-[#50e080]/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#0d9488] dark:text-[#50e080]">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-orange-500" />
                          <span className="font-mono text-sm font-semibold text-orange-500">{query.executionTime}</span>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{query.executionCount.toLocaleString()} executions</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {/* Query Text */}
                    <div className="bg-zinc-900 rounded-lg p-3 overflow-x-auto">
                      <code className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                        {query.query}
                      </code>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Avg Time</div>
                        <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{query.avgTime}</div>
                      </div>
                      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">CPU Time</div>
                        <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{query.cpuTime}</div>
                      </div>
                      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Logical Reads</div>
                        <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">{query.logicalReads}</div>
                      </div>
                      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Database</div>
                        <div className="font-mono text-xs text-zinc-900 dark:text-white truncate">{query.database}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === "events" ? (
          // Events Tab
          <div className="space-y-4">
            <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-[#0d9488] dark:text-[#50e080]" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Database Events • <span className="font-semibold text-zinc-900 dark:text-white">{dbType} Environment</span>
                </p>
              </div>
            </div>

            {events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event) => {
                  const isExpanded = expandedEvents.has(event.id);
                  return (
                    <div
                      key={event.id}
                      className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl overflow-hidden hover:border-[#0d9488] dark:hover:border-[#50e080] transition-colors"
                    >
                      <button
                        onClick={() => toggleEventExpansion(event.id)}
                        className="w-full bg-zinc-100 dark:bg-zinc-800 px-4 py-3 border-b border-zinc-300 dark:border-zinc-700 flex items-center justify-between cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            event.severity === "High" ? "bg-red-100 dark:bg-red-900/30" :
                            event.severity === "Medium" ? "bg-orange-100 dark:bg-orange-900/30" :
                            "bg-yellow-100 dark:bg-yellow-900/30"
                          }`}>
                            <AlertCircle className={`${
                              event.severity === "High" ? "text-red-600 dark:text-red-400" :
                              event.severity === "Medium" ? "text-orange-600 dark:text-orange-400" :
                              "text-yellow-600 dark:text-yellow-400"
                            }`} size={18} />
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-zinc-900 dark:text-white">{event.type}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                event.severity === "High" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                                event.severity === "Medium" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" :
                                "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                              }`}>
                                {event.severity}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock size={14} className="text-zinc-500" />
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">{event.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs text-zinc-600 dark:text-zinc-400">Database</div>
                            <div className="text-sm font-semibold text-zinc-900 dark:text-white">{event.database}</div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp size={20} className="text-zinc-600 dark:text-zinc-400" />
                          ) : (
                            <ChevronDown size={20} className="text-zinc-600 dark:text-zinc-400" />
                          )}
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 space-y-3">
                          {/* Event Description */}
                          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                            <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">Description</div>
                            <div className="text-sm text-zinc-900 dark:text-white">{event.description}</div>
                          </div>

                          {/* Event Details */}
                          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                            <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">Details</div>
                            <div className="text-xs text-zinc-700 dark:text-zinc-300 font-mono">{event.details}</div>
                          </div>

                          {/* Victim/Affected Process */}
                          {event.victim && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                              <div className="text-xs text-red-700 dark:text-red-400 mb-1 font-semibold">Deadlock Victim</div>
                              <div className="text-sm text-red-900 dark:text-red-300 font-mono">{event.victim}</div>
                            </div>
                          )}

                          {/* Resolution */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <div className="text-xs text-blue-700 dark:text-blue-400 mb-1 font-semibold">Resolution</div>
                            <div className="text-sm text-blue-900 dark:text-blue-300">{event.resolution}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 rounded-xl p-8 text-center">
                <CheckCircle2 size={48} className="mx-auto mb-3 text-green-500" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No Events Recorded</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No deadlocks or critical events have been detected in this environment.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}