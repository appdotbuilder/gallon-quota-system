import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/components/app-shell';

export default function Welcome() {
    const [employeeId, setEmployeeId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmployeeLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId.trim()) return;
        
        setIsLoading(true);
        router.get(route('employee.show'), { employee_id: employeeId }, {
            onFinish: () => setIsLoading(false)
        });
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Hero Section */}
                <div className="container mx-auto px-4 pt-20 pb-12">
                    <div className="text-center mb-12">
                        <div className="mb-6">
                            <span className="text-6xl mb-4 block">💧</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                            Sistem Jatah Galon
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-2">
                            PT Tirta Investama
                        </p>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Kelola permintaan dan distribusi galon air mineral untuk karyawan dengan mudah dan efisien
                        </p>
                    </div>

                    {/* Employee Access Form */}
                    <div className="max-w-md mx-auto mb-16">
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl text-gray-900">
                                    🔍 Akses Karyawan
                                </CardTitle>
                                <p className="text-gray-600">
                                    Scan barcode atau masukkan ID karyawan
                                </p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleEmployeeLogin} className="space-y-4">
                                    <div>
                                        <Input
                                            type="text"
                                            placeholder="Masukkan ID Karyawan (contoh: EMP001)"
                                            value={employeeId}
                                            onChange={(e) => setEmployeeId(e.target.value)}
                                            className="text-center text-lg py-3"
                                            autoFocus
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full py-3 text-lg"
                                        disabled={isLoading || !employeeId.trim()}
                                    >
                                        {isLoading ? 'Memproses...' : '📋 Cek Kuota & Request'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="text-center">
                            <div className="bg-white rounded-2xl p-8 shadow-lg border-0 h-full">
                                <div className="text-4xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">Cek Kuota</h3>
                                <p className="text-gray-600">
                                    Lihat identitas karyawan, jatah bulanan, sisa kuota, dan riwayat transaksi
                                </p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white rounded-2xl p-8 shadow-lg border-0 h-full">
                                <div className="text-4xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">Request Galon</h3>
                                <p className="text-gray-600">
                                    Ajukan permintaan galon sesuai kebutuhan dan kuota yang tersedia
                                </p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white rounded-2xl p-8 shadow-lg border-0 h-full">
                                <div className="text-4xl mb-4">✅</div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">Verifikasi Output</h3>
                                <p className="text-gray-600">
                                    Konfirmasi pengambilan galon sesuai dengan request yang telah disetujui
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quota System */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-16">
                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                            📋 Sistem Kuota Berdasarkan Grade
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                                <div className="font-bold text-green-800">G7-G8</div>
                                <div className="text-2xl font-bold text-green-900">24</div>
                                <div className="text-sm text-green-700">galon/bulan</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                                <div className="font-bold text-blue-800">G9</div>
                                <div className="text-2xl font-bold text-blue-900">12</div>
                                <div className="text-sm text-blue-700">galon/bulan</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                                <div className="font-bold text-purple-800">G10</div>
                                <div className="text-2xl font-bold text-purple-900">10</div>
                                <div className="text-sm text-purple-700">galon/bulan</div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                                <div className="font-bold text-orange-800">G11-G13</div>
                                <div className="text-2xl font-bold text-orange-900">7</div>
                                <div className="text-sm text-orange-700">galon/bulan</div>
                            </div>
                        </div>
                        <p className="text-center text-gray-600 mt-4 text-sm">
                            Kuota direset otomatis setiap pergantian bulan
                        </p>
                    </div>

                    {/* Admin Access */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100">
                            <CardHeader className="text-center">
                                <CardTitle className="text-lg text-red-800">
                                    👥 Admin HR/Personalia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-red-700 mb-4">
                                    Kelola data karyawan dan kuota
                                </p>
                                <Link href="/admin/hr/login">
                                    <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                                        Login Admin HR
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
                            <CardHeader className="text-center">
                                <CardTitle className="text-lg text-green-800">
                                    🏭 Admin Gudang
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-green-700 mb-4">
                                    Verifikasi ketersediaan stok
                                </p>
                                <Link href="/admin/warehouse/login">
                                    <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                                        Login Admin Gudang
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                            <CardHeader className="text-center">
                                <CardTitle className="text-lg text-blue-800">
                                    📈 Admin Administrasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-blue-700 mb-4">
                                    Laporan dan download data
                                </p>
                                <Link href="/admin/report/login">
                                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                                        Login Admin Report
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-gray-300">
                            © 2024 PT Tirta Investama - Sistem Jatah Galon
                        </p>
                    </div>
                </footer>
            </div>
        </AppShell>
    );
}