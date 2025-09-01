import React from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    pendingRequests: GallonRequest[];
    readyRequests: GallonRequest[];
    [key: string]: unknown;
}

export default function WarehouseIndex({ todaysSummary, pendingRequests, readyRequests }: Props) {
    const handleVerifyStock = (requestId: number) => {
        router.post(route('admin.warehouse.store'), {
            request_id: requestId
        });
    };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            ready: 'bg-green-100 text-green-800 border-green-200',
            completed: 'bg-blue-100 text-blue-800 border-blue-200'
        };
        const labels = {
            pending: '⏳ Menunggu Verifikasi',
            ready: '✅ Siap Diambil',
            completed: '🏁 Selesai'
        };
        return (
            <Badge className={variants[status as keyof typeof variants]}>
                {labels[status as keyof typeof labels]}
            </Badge>
        );
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    🏭 Dashboard Admin Gudang
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Verifikasi ketersediaan stok dan kelola request karyawan
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
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                <CardTitle className="text-lg">
                                    📊 Total Request Hari Ini
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
                                    ✅ Total Diambil Hari Ini
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">
                                        {todaysSummary.total_outputs}
                                    </div>
                                    <div className="text-sm text-gray-600">galon diambil</div>
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
                                    <div className="text-sm text-gray-600">karyawan request</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Pending Requests */}
                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                                <CardTitle className="text-xl">
                                    ⏳ Request Pending ({pendingRequests.length})
                                </CardTitle>
                                <p className="text-yellow-100">
                                    Menunggu verifikasi ketersediaan stok
                                </p>
                            </CardHeader>
                            <CardContent className="p-6">
                                {pendingRequests.length > 0 ? (
                                    <div className="space-y-4">
                                        {pendingRequests.map((request) => (
                                            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {request.employee.name}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            ID: {request.employee.employee_id} • {request.employee.department}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            📍 {request.employee.location}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-blue-600">
                                                            {request.quantity} galon
                                                        </div>
                                                        <Badge className="bg-purple-100 text-purple-800">
                                                            {request.employee.grade}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-sm text-gray-600 mb-3">
                                                    🕐 Request: {formatDateTime(request.input_time)}
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    {getStatusBadge(request.status)}
                                                    <Button
                                                        onClick={() => handleVerifyStock(request.id)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                        size="sm"
                                                    >
                                                        ✅ Verifikasi Stok
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="text-4xl mb-2">🎉</div>
                                        <p>Tidak ada request pending</p>
                                        <p className="text-sm">Semua request sudah diverifikasi!</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Ready Requests */}
                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                <CardTitle className="text-xl">
                                    ✅ Siap Diambil ({readyRequests.length})
                                </CardTitle>
                                <p className="text-green-100">
                                    Stok sudah tersedia, menunggu pengambilan
                                </p>
                            </CardHeader>
                            <CardContent className="p-6">
                                {readyRequests.length > 0 ? (
                                    <div className="space-y-4">
                                        {readyRequests.map((request) => (
                                            <div key={request.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="font-medium text-green-900">
                                                            {request.employee.name}
                                                        </div>
                                                        <div className="text-sm text-green-700">
                                                            ID: {request.employee.employee_id} • {request.employee.department}
                                                        </div>
                                                        <div className="text-sm text-green-700">
                                                            📍 {request.employee.location}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-green-600">
                                                            {request.quantity} galon
                                                        </div>
                                                        <Badge className="bg-purple-100 text-purple-800">
                                                            {request.employee.grade}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-sm text-green-700 mb-3">
                                                    🕐 Request: {formatDateTime(request.input_time)}
                                                </div>

                                                <div className="flex justify-center">
                                                    {getStatusBadge(request.status)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="text-4xl mb-2">📦</div>
                                        <p>Tidak ada stok yang siap diambil</p>
                                        <p className="text-sm">Verifikasi request pending terlebih dahulu</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Instructions */}
                    <Card className="shadow-lg mt-8">
                        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                            <CardTitle className="text-xl">
                                ℹ️ Petunjuk Penggunaan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">1. Verifikasi Request</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Klik tombol "Verifikasi Stok" pada request pending untuk mengkonfirmasi ketersediaan barang di gudang.
                                    </p>
                                    
                                    <h3 className="font-semibold text-gray-900 mb-2">2. Monitoring Status</h3>
                                    <p className="text-gray-600 text-sm">
                                        Pantau request yang sudah siap diambil. Karyawan akan mengkonfirmasi pengambilan melalui sistem.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">3. Laporan Harian</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Data summary akan reset otomatis setiap hari untuk memberikan laporan harian yang akurat.
                                    </p>
                                    
                                    <h3 className="font-semibold text-gray-900 mb-2">4. Prioritas</h3>
                                    <p className="text-gray-600 text-sm">
                                        Prioritaskan verifikasi berdasarkan grade karyawan dan waktu request untuk efisiensi maksimal.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}