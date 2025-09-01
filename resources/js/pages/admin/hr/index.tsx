import React from 'react';
import { Link } from '@inertiajs/react';
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
    monthly_quota: number;
    remaining_quota: number;
    created_at: string;
}

interface PaginationData {
    data: Employee[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    employees: PaginationData;
    [key: string]: unknown;
}

export default function HrIndex({ employees }: Props) {
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

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    👥 Admin HR/Personalia
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Kelola data karyawan dan kuota galon
                                </p>
                            </div>
                            <Link href={route('admin.hr.create')}>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    ➕ Tambah Karyawan
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{employees.total}</div>
                                    <div className="text-sm text-gray-600">Total Karyawan</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {employees.data.filter(e => ['G7', 'G8'].includes(e.grade)).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Grade Tinggi (G7-G8)</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {employees.data.filter(e => ['G9', 'G10'].includes(e.grade)).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Grade Menengah (G9-G10)</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {employees.data.filter(e => ['G11', 'G12', 'G13'].includes(e.grade)).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Grade Rendah (G11-G13)</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Employees Table */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl">📊 Daftar Karyawan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Departemen</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Lokasi</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Kuota</th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.data.map((employee) => (
                                            <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <span className="font-mono text-sm">{employee.employee_id}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-gray-900">{employee.name}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-gray-700">{employee.department}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge className={getGradeBadgeColor(employee.grade)}>
                                                        {employee.grade}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-gray-700">📍 {employee.location}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-sm">
                                                        <div className={`font-medium ${
                                                            employee.remaining_quota > 0 ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                            {employee.remaining_quota}/{employee.monthly_quota}
                                                        </div>
                                                        <div className="text-gray-500">galon</div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <Link href={route('admin.hr.show', employee.id)}>
                                                            <Button variant="outline" size="sm">
                                                                👁️ Detail
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('admin.hr.edit', employee.id)}>
                                                            <Button variant="outline" size="sm">
                                                                ✏️ Edit
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {employees.last_page > 1 && (
                                <div className="flex justify-center mt-6">
                                    <div className="flex gap-2">
                                        {employees.links.map((link, index) => (
                                            <div key={index}>
                                                {link.url ? (
                                                    <Link
                                                        href={link.url}
                                                        className={`px-3 py-2 text-sm border rounded ${
                                                            link.active
                                                                ? 'bg-blue-500 text-white border-blue-500'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : (
                                                    <span
                                                        className="px-3 py-2 text-sm text-gray-400 border border-gray-300 rounded"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}