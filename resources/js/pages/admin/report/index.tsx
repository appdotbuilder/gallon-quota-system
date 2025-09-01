import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { AppShell } from '@/components/app-shell';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    department: string;
    grade: string;
    location: string;
}

interface GallonRequest {
    id: number;
    quantity: number;
    status: 'pending' | 'ready' | 'completed';
    input_time: string;
    output_time: string | null;
    employee: Employee;
}

interface DailySummary {
    id: number;
    date: string;
    total_requests: number;
    total_outputs: number;
    unique_requesters: number;
}

interface Props {
    todaysSummary: DailySummary;
    todaysRequests: GallonRequest[];
    [key: string]: unknown;
}

export default function ReportIndex({ todaysSummary, todaysRequests }: Props) {
    const [downloadDate, setDownloadDate] = useState(new Date().toISOString().split('T')[0]);

    const handleDownloadReport = () => {
        router.post(route('admin.report.download'), {
            date: downloadDate
        });
    };



    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            ready: 'bg-green-100 text-green-800 border-green-200',
            completed: 'bg-blue-100 text-blue-800 border-blue-200'
        };
        const labels = {
            pending: '⏳ Pending',
            ready: '✅ Ready',
            completed: '🏁 Completed'
        };
        return (
            <Badge className={variants[status as keyof typeof variants]}>
                {labels[status as keyof typeof labels]}
            </Badge>
        );
    };

    const getGradeBadgeColor = (grade: string) => {
        const colors = {
            'G7': 'bg-green-100 text-green-800 border-green-200',
            'G8': 'bg-green-100 text-green-800 border-green-200',
            'G9': 'bg-blue-100 text-blue-800 border-blue-200',
            'G10': 'bg-purple-100 text-purple-800 border-purple-200',
            'G11': 'bg-orange-100 text-orange-800 border-orange-200',
            'G12': 'bg-orange-100 text-orange-800 border-orange-200',
            'G13': 'bg-orange-100 text-orange-800 border-orange-200',
        };
        return colors[grade as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const completedRequests = todaysRequests.filter(r => r.status === 'completed');
    const pendingReadyRequests = todaysRequests.filter(r => r.status === 'pending' || r.status === 'ready');

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    📈 Dashboard Admin Administrasi
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Laporan harian dan download data transaksi galon
                                </p>
                            </div>
                            <Button 
                                onClick={() => router.get('/')}
                                variant="outline"
                            >
                                ← Kembali ke Beranda
                            </Button>
                        </div>
                    </div>

                    {/* Daily Summary */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                <CardTitle className="text-lg">
                                    📊 Total Request
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">
                                        {todaysSummary.total_requests}
                                    </div>
                                    <div className="text-sm text-gray-600">galon direquest</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                <CardTitle className="text-lg">
                                    ✅ Total Output
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">
                                        {todaysSummary.total_outputs}
                                    </div>
                                    <div className="text-sm text-gray-600">galon keluar</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                <CardTitle className="text-lg">
                                    👥 Karyawan Aktif
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600">
                                        {todaysSummary.unique_requesters}
                                    </div>
                                    <div className="text-sm text-gray-600">karyawan</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                <CardTitle className="text-lg">
                                    📝 Total Transaksi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-600">
                                        {todaysRequests.length}
                                    </div>
                                    <div className="text-sm text-gray-600">transaksi</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Download Report Section */}
                    <Card className="shadow-lg mb-8">
                        <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                            <CardTitle className="text-xl">
                                📄 Download Laporan Harian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex gap-4 items-end max-w-md">
                                <div className="flex-1">
                                    <Label htmlFor="download-date" className="text-sm font-medium text-gray-700">
                                        Pilih Tanggal
                                    </Label>
                                    <Input
                                        id="download-date"
                                        type="date"
                                        value={downloadDate}
                                        onChange={(e) => setDownloadDate(e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <Button
                                    onClick={handleDownloadReport}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    📥 Download Excel
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                File akan berisi data: ID Karyawan, Nama, Departemen, Grade, Lokasi, Jumlah Galon, Tanggal & Jam Input/Output, Status
                            </p>
                        </CardContent>
                    </Card>

                    {/* Transaction History */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                            <CardTitle className="text-xl">
                                📋 Riwayat Transaksi Hari Ini
                            </CardTitle>
                            <p className="text-gray-200">
                                Total {todaysRequests.length} transaksi • {completedRequests.length} selesai • {pendingReadyRequests.length} dalam proses
                            </p>
                        </CardHeader>
                        <CardContent className="p-6">
                            {todaysRequests.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full table-auto">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Dept</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Lokasi</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Qty</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Input</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Output</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {todaysRequests.map((request) => (
                                                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <span className="font-mono text-sm">{request.employee.employee_id}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium text-gray-900">{request.employee.name}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-gray-700">{request.employee.department}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge className={getGradeBadgeColor(request.employee.grade)}>
                                                            {request.employee.grade}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-gray-700">📍 {request.employee.location}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="font-medium text-blue-600">{request.quantity}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="text-sm">
                                                            <div className="text-gray-900">
                                                                {new Date(request.input_time).toLocaleDateString('id-ID')}
                                                            </div>
                                                            <div className="text-gray-600">
                                                                {new Date(request.input_time).toLocaleTimeString('id-ID', { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit' 
                                                                })}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {request.output_time ? (
                                                            <div className="text-sm">
                                                                <div className="text-gray-900">
                                                                    {new Date(request.output_time).toLocaleDateString('id-ID')}
                                                                </div>
                                                                <div className="text-gray-600">
                                                                    {new Date(request.output_time).toLocaleTimeString('id-ID', { 
                                                                        hour: '2-digit', 
                                                                        minute: '2-digit' 
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">-</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {getStatusBadge(request.status)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">📊</div>
                                    <p>Belum ada transaksi hari ini</p>
                                    <p className="text-sm">Data transaksi akan muncul setelah karyawan melakukan request</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Summary Stats */}
                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                <CardTitle className="text-lg">
                                    ✅ Transaksi Selesai
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 mb-2">
                                        {completedRequests.length} transaksi
                                    </div>
                                    <div className="text-3xl font-bold text-green-800">
                                        {completedRequests.reduce((sum, req) => sum + req.quantity, 0)} galon
                                    </div>
                                    <div className="text-sm text-gray-600">total keluar</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                <CardTitle className="text-lg">
                                    ⏳ Dalam Proses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600 mb-2">
                                        {pendingReadyRequests.length} transaksi
                                    </div>
                                    <div className="text-3xl font-bold text-orange-800">
                                        {pendingReadyRequests.reduce((sum, req) => sum + req.quantity, 0)} galon
                                    </div>
                                    <div className="text-sm text-gray-600">menunggu pickup</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}