const formatValue = (v: any) => {
  if (v == null) return "";
  if (Array.isArray(v)) return `"${v.join("; ")}"`;
  return typeof v === "string" && v.includes(",") ? `"${v}"` : String(v);
};

export const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers,
    ...data.map((row) => headers.map((h) => formatValue(row[h]))),
  ].join("\n");

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
};
