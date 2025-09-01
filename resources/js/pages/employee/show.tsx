import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppShell } from '@/components/app-shell';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    department: string;
    grade: string;
    location: string;
    monthly_quota: number;
    remaining_quota: number;
    last_quota_reset: string;
}

interface GallonRequest {
    id: number;
    quantity: number;
    status: 'pending' | 'ready' | 'completed';
    input_time: string;
    output_time: string | null;
}

interface Props {
    employee: Employee;
    recentRequests: GallonRequest[];
    [key: string]: unknown;
}

export default function ShowEmployee({ employee, recentRequests }: Props) {
    const [requestQuantity, setRequestQuantity] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const handleRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (requestQuantity > employee.remaining_quota) return;
        
        setIsLoading(true);
        router.post(route('employee.store'), {
            employee_id: employee.employee_id,
            quantity: requestQuantity
        }, {
            onFinish: () => {
                setIsLoading(false);
                setRequestQuantity(1);
            }
        });
    };

    const handleOutput = (requestId: number) => {
        setIsLoading(true);
        router.patch(route('employee.update'), {
            employee_id: employee.employee_id,
            request_id: requestId
        }, {
            onFinish: () => setIsLoading(false)
        });
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            ready: 'bg-green-100 text-green-800 border-green-200',
            completed: 'bg-blue-100 text-blue-800 border-blue-200'
        };
        const labels = {
            pending: '⏳ Menunggu',
            ready: '✅ Siap Diambil',
            completed: '🏁 Selesai'
        };
        return (
            <Badge className={variants[status as keyof typeof variants]}>
                {labels[status as keyof typeof labels]}
            </Badge>
        );
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

    const readyRequests = recentRequests.filter(r => r.status === 'ready');

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Button 
                            onClick={() => router.get('/')}
                            variant="outline"
                            className="mb-4"
                        >
                            ← Kembali ke Beranda
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            💧 Dashboard Karyawan
                        </h1>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <Alert className="mb-6 border-green-200 bg-green-50">
                            <AlertDescription className="text-green-800">
                                ✅ {flash.success}
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    {flash?.error && (
                        <Alert className="mb-6 border-red-200 bg-red-50">
                            <AlertDescription className="text-red-800">
                                ❌ {flash.error}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Employee Info */}
                        <div className="lg:col-span-1">
                            <Card className="shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                    <CardTitle className="text-xl">
                                        👤 Identitas Karyawan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">ID Karyawan</label>
                                            <p className="text-lg font-semibold text-gray-900">{employee.employee_id}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Nama</label>
                                            <p className="text-lg font-semibold text-gray-900">{employee.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Departemen</label>
                                            <p className="text-lg text-gray-700">{employee.department}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Grade</label>
                                            <Badge className="bg-purple-100 text-purple-800 text-lg px-3 py-1">
                                                {employee.grade}
                                            </Badge>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Lokasi</label>
                                            <p className="text-lg text-gray-700">📍 {employee.location}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quota Info */}
                            <Card className="shadow-lg mt-6">
                                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                    <CardTitle className="text-xl">
                                        📊 Informasi Kuota
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Jatah Bulanan</label>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {employee.monthly_quota} galon
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Sisa Kuota</label>
                                            <p className={`text-2xl font-bold ${
                                                employee.remaining_quota > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {employee.remaining_quota} galon
                                            </p>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div 
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ 
                                                        width: `${(employee.remaining_quota / employee.monthly_quota) * 100}%` 
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Reset Terakhir</label>
                                            <p className="text-sm text-gray-700">
                                                {new Date(employee.last_quota_reset).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Actions & History */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Request Form */}
                            <Card className="shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                    <CardTitle className="text-xl">
                                        📝 Request Galon
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleRequest} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Jumlah Galon
                                            </label>
                                            <div className="flex gap-4 items-end">
                                                <div className="flex-1">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max={employee.remaining_quota}
                                                        value={requestQuantity}
                                                        onChange={(e) => setRequestQuantity(parseInt(e.target.value) || 1)}
                                                        className="text-lg text-center"
                                                        disabled={employee.remaining_quota === 0}
                                                    />
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Maksimal: {employee.remaining_quota} galon
                                                    </p>
                                                </div>
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading || employee.remaining_quota === 0 || requestQuantity > employee.remaining_quota}
                                                    className="px-8"
                                                >
                                                    {isLoading ? 'Memproses...' : '📤 Submit Request'}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                    
                                    {employee.remaining_quota === 0 && (
                                        <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                                            <AlertDescription className="text-yellow-800">
                                                ⚠️ Kuota Anda sudah habis untuk bulan ini. Kuota akan direset otomatis pada awal bulan berikutnya.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Output Section */}
                            {readyRequests.length > 0 && (
                                <Card className="shadow-lg">
                                    <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                                        <CardTitle className="text-xl">
                                            ✅ Siap Diambil
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {readyRequests.map((request) => (
                                                <div key={request.id} className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                                    <div>
                                                        <p className="font-medium text-green-800">
                                                            Request #{request.id} - {request.quantity} galon
                                                        </p>
                                                        <p className="text-sm text-green-600">
                                                            Diminta: {formatDateTime(request.input_time)}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleOutput(request.id)}
                                                        disabled={isLoading}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        🏁 Konfirmasi Ambil
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Request History */}
                            <Card className="shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                                    <CardTitle className="text-xl">
                                        📋 Riwayat Request
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {recentRequests.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentRequests.map((request) => (
                                                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                Request #{request.id}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {request.quantity} galon
                                                            </p>
                                                        </div>
                                                        {getStatusBadge(request.status)}
                                                    </div>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p>📅 Input: {formatDateTime(request.input_time)}</p>
                                                        {request.output_time && (
                                                            <p>🏁 Output: {formatDateTime(request.output_time)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">
                                            Belum ada riwayat request
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}