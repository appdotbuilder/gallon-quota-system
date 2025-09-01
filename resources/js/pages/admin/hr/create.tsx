import React from 'react';
import { router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppShell } from '@/components/app-shell';
import InputError from '@/components/input-error';



export default function CreateEmployee() {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        name: '',
        department: '',
        grade: '',
        location: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.hr.store'));
    };

    const gradeOptions = [
        { value: 'G7', label: 'G7 (24 galon/bulan)' },
        { value: 'G8', label: 'G8 (24 galon/bulan)' },
        { value: 'G9', label: 'G9 (12 galon/bulan)' },
        { value: 'G10', label: 'G10 (10 galon/bulan)' },
        { value: 'G11', label: 'G11 (7 galon/bulan)' },
        { value: 'G12', label: 'G12 (7 galon/bulan)' },
        { value: 'G13', label: 'G13 (7 galon/bulan)' },
    ];

    const departmentOptions = [
        'HR',
        'IT',
        'Finance',
        'Operations',
        'Marketing',
        'Production',
        'Quality Control',
        'Logistics',
        'Administration',
        'Management'
    ];

    const locationOptions = [
        'Jakarta',
        'Surabaya',
        'Bandung',
        'Medan',
        'Makassar',
        'Semarang',
        'Palembang',
        'Balikpapan'
    ];

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Button 
                            onClick={() => router.get(route('admin.hr.index'))}
                            variant="outline"
                            className="mb-4"
                        >
                            ← Kembali ke Daftar Karyawan
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            ➕ Tambah Karyawan Baru
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Masukkan data karyawan baru dan sistem akan otomatis menyesuaikan kuota berdasarkan grade
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <Card className="shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                <CardTitle className="text-xl">
                                    📝 Form Data Karyawan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Employee ID */}
                                    <div className="space-y-2">
                                        <Label htmlFor="employee_id" className="text-sm font-medium text-gray-700">
                                            ID Karyawan <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="employee_id"
                                            type="text"
                                            value={data.employee_id}
                                            onChange={(e) => setData('employee_id', e.target.value)}
                                            placeholder="Contoh: EMP001"
                                            className={errors.employee_id ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.employee_id} />
                                        <p className="text-sm text-gray-500">
                                            ID unik untuk scanning barcode
                                        </p>
                                    </div>

                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Masukkan nama lengkap karyawan"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Department */}
                                    <div className="space-y-2">
                                        <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                                            Departemen <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={data.department} onValueChange={(value) => setData('department', value)}>
                                            <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih departemen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departmentOptions.map((dept) => (
                                                    <SelectItem key={dept} value={dept}>
                                                        {dept}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.department} />
                                    </div>

                                    {/* Grade */}
                                    <div className="space-y-2">
                                        <Label htmlFor="grade" className="text-sm font-medium text-gray-700">
                                            Grade <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={data.grade} onValueChange={(value) => setData('grade', value)}>
                                            <SelectTrigger className={errors.grade ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih grade karyawan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {gradeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.grade} />
                                        <p className="text-sm text-gray-500">
                                            Kuota galon akan disesuaikan otomatis berdasarkan grade
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                                            Lokasi <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={data.location} onValueChange={(value) => setData('location', value)}>
                                            <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih lokasi kerja" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locationOptions.map((loc) => (
                                                    <SelectItem key={loc} value={loc}>
                                                        📍 {loc}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.location} />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.get(route('admin.hr.index'))}
                                            className="flex-1"
                                        >
                                            ❌ Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                        >
                                            {processing ? 'Menyimpan...' : '✅ Simpan Karyawan'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}