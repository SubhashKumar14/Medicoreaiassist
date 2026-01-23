import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function LabTable({ extractedData }) {
    if (!extractedData || Object.keys(extractedData).length === 0) return null;

    // extractedData is { "Hemoglobin": { value, unit, status, reference } }

    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-700">Test Parameter</TableHead>
                        <TableHead className="font-bold text-slate-700">Result</TableHead>
                        <TableHead className="font-bold text-slate-700">Reference Range</TableHead>
                        <TableHead className="font-bold text-slate-700">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(extractedData).map(([test, data]) => {
                        const status = data.status?.toUpperCase() || "NORMAL";
                        const isAbnormal = status !== "NORMAL";

                        return (
                            <TableRow key={test} className={isAbnormal ? "bg-red-50/50 hover:bg-red-50" : "hover:bg-slate-50"}>
                                <TableCell className="font-medium text-slate-900">{test}</TableCell>
                                <TableCell>
                                    <span className="font-bold text-slate-800">{data.value}</span>
                                    <span className="text-xs text-slate-500 ml-1">{data.unit}</span>
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm">{data.reference || "N/A"}</TableCell>
                                <TableCell>
                                    <StatusBadge status={status} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

function StatusBadge({ status }) {
    let color = "bg-green-100 text-green-700 border-green-200";
    let icon = <CheckCircle className="w-3 h-3 mr-1" />;

    if (status === "LOW") {
        color = "bg-amber-100 text-amber-700 border-amber-200";
        icon = <TrendingDown className="w-3 h-3 mr-1" />;
    } else if (status === "HIGH") {
        color = "bg-red-100 text-red-700 border-red-200";
        icon = <TrendingUp className="w-3 h-3 mr-1" />;
    }

    return (
        <Badge variant="outline" className={`${color} flex items-center w-fit`}>
            {icon} {status}
        </Badge>
    );
}

export { StatusBadge };
