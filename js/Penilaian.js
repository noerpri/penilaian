/**
 * ============================================================================
 * KELAS CUSTOM: Penilaian
 * ============================================================================
 * 
 * Kelas ini mengelola semua data penilaian siswa termasuk:
 * - Ulangan Harian
 * - Penilaian Sumatif
 * - Ujian Akhir
 * - Tugas Praktik
 * - Tugas LKS
 * - Tugas Mandiri
 * - Tugas Kelompok
 * 
 * Author: Sistem Penilaian Siswa
 * Version: 1.0.0
 * ============================================================================
 */

class Penilaian {
    /**
     * Constructor untuk inisialisasi Penilaian
     */
    constructor() {
        this.daftarSiswa = [];
        this.nilaiUlanganHarian = [];
        this.nilaiSumatif = [];
        this.nilaiUjianAkhir = [];
        this.nilaiTugasPraktek = [];
        this.nilaiTugasLKS = [];
        this.nilaiTugasMandiri = [];
        this.nilaiTugasKelompok = [];
        
        // Bobot penilaian default
        this.bobot = {
            ulangan: 20,
            sumatif: 20,
            ujian: 30,
            praktek: 10,
            lks: 5,
            mandiri: 5,
            kelompok: 10
        };
        
        // Kriteria penilaian
        this.kriteria = {
            kkm: 75,
            nilaiA: 85,
            nilaiB: 75,
            nilaiC: 60
        };
        
        this.loadFromLocalStorage();
    }

    /**
     * ============================================================================
     * MANAJEMEN SISWA
     * ============================================================================
     */

    /**
     * Tambah siswa baru
     * @param {Object} dataSiswa - Data siswa {id, nama, nis, kelas, absen}
     * @returns {boolean} - Status penambahan
     */
    tambahSiswa(dataSiswa) {
        try {
            if (!dataSiswa.nama || !dataSiswa.nis) {
                throw new Error('Nama dan NIS harus diisi');
            }

            const siswa = {
                id: this.generateId(),
                nama: dataSiswa.nama,
                nis: dataSiswa.nis,
                kelas: dataSiswa.kelas || '',
                absen: dataSiswa.absen || 0,
                tanggalTambah: new Date().toISOString()
            };

            this.daftarSiswa.push(siswa);
            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error menambah siswa:', error.message);
            return false;
        }
    }

    /**
     * Dapatkan semua siswa
     * @returns {Array} - Daftar siswa
     */
    getDaftarSiswa() {
        return this.daftarSiswa;
    }

    /**
     * Dapatkan siswa berdasarkan ID
     * @param {string} idSiswa - ID siswa
     * @returns {Object|null} - Data siswa
     */
    getSiswaById(idSiswa) {
        return this.daftarSiswa.find(siswa => siswa.id === idSiswa) || null;
    }

    /**
     * Hapus siswa
     * @param {string} idSiswa - ID siswa
     * @returns {boolean} - Status penghapusan
     */
    hapusSiswa(idSiswa) {
        const index = this.daftarSiswa.findIndex(siswa => siswa.id === idSiswa);
        if (index > -1) {
            this.daftarSiswa.splice(index, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    /**
     * ============================================================================
     * PENILAIAN ULANGAN HARIAN
     * ============================================================================
     */

    /**
     * Tambah nilai ulangan harian
     * @param {Object} data - {idSiswa, tipe, nilai, catatan}
     * @returns {boolean}
     */
    tambahNilaiUlanganHarian(data) {
        try {
            if (!data.idSiswa || !data.tipe || data.nilai === undefined) {
                throw new Error('Data ulangan harian tidak lengkap');
            }

            if (data.nilai < 0 || data.nilai > 100) {
                throw new Error('Nilai harus antara 0-100');
            }

            const nilaiObj = {
                id: this.generateId(),
                idSiswa: data.idSiswa,
                tipe: data.tipe,
                nilai: parseFloat(data.nilai),
                catatan: data.catatan || '',
                tanggal: new Date().toISOString()
            };

            this.nilaiUlanganHarian.push(nilaiObj);
            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error menambah nilai ulangan:', error.message);
            return false;
        }
    }

    /**
     * Dapatkan nilai ulangan harian siswa
     * @param {string} idSiswa - ID siswa
     * @returns {Array} - Daftar nilai ulangan
     */
    getNilaiUlanganHarian(idSiswa = null) {
        if (idSiswa) {
            return this.nilaiUlanganHarian.filter(n => n.idSiswa === idSiswa);
        }
        return this.nilaiUlanganHarian;
    }

    /**
     * Hitung rata-rata ulangan harian
     * @param {string} idSiswa - ID siswa
     * @returns {number} - Rata-rata nilai
     */
    hitungRataRataUlanganHarian(idSiswa) {
        const nilai = this.getNilaiUlanganHarian(idSiswa);
        if (nilai.length === 0) return 0;
        const total = nilai.reduce((sum, n) => sum + n.nilai, 0);
        return parseFloat((total / nilai.length).toFixed(2));
    }

    /**
     * ============================================================================
     * PENILAIAN SUMATIF
     * ============================================================================
     */

    /**
     * Tambah nilai sumatif
     * @param {Object} data - {idSiswa, tipe, nilai, catatan}
     * @returns {boolean}
     */
    tambahNilaiSumatif(data) {
        try {
            if (!data.idSiswa || !data.tipe || data.nilai === undefined) {
                throw new Error('Data sumatif tidak lengkap');
            }

            if (data.nilai < 0 || data.nilai > 100) {
                throw new Error('Nilai harus antara 0-100');
            }

            const nilaiObj = {
                id: this.generateId(),
                idSiswa: data.idSiswa,
                tipe: data.tipe,
                nilai: parseFloat(data.nilai),
                catatan: data.catatan || '',
                tanggal: new Date().toISOString()
            };

            this.nilaiSumatif.push(nilaiObj);
            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error menambah nilai sumatif:', error.message);
            return false;
        }
    }

    /**
     * Dapatkan nilai sumatif siswa
     * @param {string} idSiswa - ID siswa
     * @returns {Array} - Daftar nilai sumatif
     */
    getNilaiSumatif(idSiswa = null) {
        if (idSiswa) {
            return this.nilaiSumatif.filter(n => n.idSiswa === idSiswa);
        }
        return this.nilaiSumatif;
    }

    /**
     * Hitung rata-rata sumatif
     * @param {string} idSiswa - ID siswa
     * @returns {number} - Rata-rata nilai
     */
    hitungRataRataSumatif(idSiswa) {
        const nilai = this.getNilaiSumatif(idSiswa);
        if (nilai.length === 0) return 0;
        const total = nilai.reduce((sum, n) => sum + n.nilai, 0);
        return parseFloat((total / nilai.length).toFixed(2));
    }

    /**
     * ============================================================================
     * PENILAIAN UJIAN AKHIR
     * ============================================================================
     */

    /**
     * Tambah nilai ujian akhir
     * @param {Object} data - {idSiswa, nilai, tanggalUjian, catatan}
     * @returns {boolean}
     */
    tambahNilaiUjianAkhir(data) {
        try {
            if (!data.idSiswa || data.nilai === undefined) {
                throw new Error('Data ujian akhir tidak lengkap');
            }

            if (data.nilai < 0 || data.nilai > 100) {
                throw new Error('Nilai harus antara 0-100');
            }

            // Cek apakah siswa sudah punya nilai ujian akhir
            const existing = this.nilaiUjianAkhir.find(n => n.idSiswa === data.idSiswa);
            if (existing) {
                existing.nilai = parseFloat(data.nilai);
                existing.tanggalUjian = data.tanggalUjian || new Date().toISOString();
                existing.catatan = data.catatan || '';
                existing.tanggalUpdate = new Date().toISOString();
            } else {
                const nilaiObj = {
                    id: this.generateId(),
                    idSiswa: data.idSiswa,
                    nilai: parseFloat(data.nilai),
                    tanggalUjian: data.tanggalUjian || new Date().toISOString(),
                    catatan: data.catatan || '',
                    tanggal: new Date().toISOString()
                };
                this.nilaiUjianAkhir.push(nilaiObj);
            }

            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error menambah nilai ujian akhir:', error.message);
            return false;
        }
    }

    /**
     * Dapatkan nilai ujian akhir siswa
     * @param {string} idSiswa - ID siswa
     * @returns {Object|null} - Nilai ujian akhir
     */
    getNilaiUjianAkhir(idSiswa = null) {
        if (idSiswa) {
            return this.nilaiUjianAkhir.find(n => n.idSiswa === idSiswa) || null;
        }
        return this.nilaiUjianAkhir;
    }

    /**
     * ============================================================================
     * PENILAIAN TUGAS PRAKTIK
     * ============================================================================
     */

    /**
     * Tambah nilai tugas praktik
     * @param {Object} data - {idSiswa, tipe, nilai, catatan}
     * @returns {boolean}
     */
    tambahNilaiTugasPraktek(data) {
        try {
            if (!data.idSiswa || !data.tipe || data.nilai === undefined) {
                throw new Error('Data tugas praktik tidak lengkap');
            }

            if (data.nilai < 0 || data.nilai > 100) {
                throw new Error('Nilai harus antara 0-100');
            }

            const nilaiObj = {
                id: this.generateId(),
                idSiswa: data.idSiswa,
                tipe: data.tipe,
                nilai: parseFloat(data.nilai),
                catatan: data.catatan || '',
                tanggal: new Date().toISOString()
            };

            this.nilaiTugasPraktek.push(nilaiObj);
            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error menambah nilai tugas praktik:', error.message);
            return false;
        }
    }

    /**
     * Dapatkan nilai tugas praktik siswa
     * @param {string} idSiswa - ID siswa
     * @returns {Array} - Daftar nilai tugas praktik
     */
    getNilaiTugasPraktek(idSiswa = null) {
        if (idSiswa) {
            return this.nilaiTugasPraktek.filter(n => n.idSiswa === idSiswa);
        }
        return this.nilaiTugasPraktek;
    }

    /**
     * Hitung rata-rata tugas praktik
     * @param {string} idSiswa - ID siswa
     * @returns {number} - Rata-rata nilai
     */
    hitungRataRataTugasPraktek(idSiswa) {
        const nilai = this.getNilaiTugasPraktek(idSiswa);
        if (nilai.length === 0) return 0;
        const total = nilai.reduce((sum, n) => sum + n.nilai, 0);
        return parseFloat((total / nilai.length).toFixed(2));
    }

    /**
     * ============================================================================
     * PENILAIAN TUGAS LKS
     * ============================================================================
     */

    /**
     * Tambah nilai tugas LKS
     * @param {Object} data - {idSiswa, tipe, nilai, catatan}
     * @returns {boolean}
     */
    tambahNilaiTugasLKS(data) {
        try {
            if (!data.idSiswa || !data.tipe || data.nilai === undefined) {
                throw new Error('Data tugas LKS tidak lengkap');
            }

            if (data.nilai < 0 || data.nilai > 100) {
                throw new Error('Nilai harus antara 0-100');
            }

            const nilaiObj = {
                id: this.generateId(),
                idSiswa: data.idSiswa,
                tipe: data.tipe,
                nilai: parseFloat(data.nilai),
                catatan: data.catatan || '',
                tanggal: new Date().toISOString()
            };

            this.nilaiTugasLKS.push(nilaiObj);
            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error menambah nilai tugas LKS:', error.message);
            return false;
        }
    }

    /**
     * Dapatkan nilai tugas LKS siswa
     * @param {string} idSiswa - ID siswa
     * @returns {Array} - Daftar nilai tugas LKS
     */
    getNilaiTugasLKS(idSiswa = null) {
        if (idSiswa) {
            return this.nilaiTugasLKS.filter(n => n.idSiswa === idSiswa);
        }
        return this.nilaiTugasLKS;
    }

    /**
     * Hitung rata-rata tugas LKS
     * @param {string} idSiswa - ID siswa
     * @returns {number} - Rata-rata nilai
     */
    hitungRataRataTugasLKS(idSiswa) {
        const nilai = this.getNilaiTugasLKS(idSiswa);
        if (nilai.length === 0) return 0;
        const total = nilai.reduce((sum, n) => sum + n.nilai, 0);
        return parseFloat((total / nilai.length).toFixed(2));
    }

    /**
     * ============================================================================
     * PENILAIAN TUGAS MANDIRI
     * ============================================================================
     */

    /**
     * Tambah nilai tugas mandiri
     * @param {Object} data - {idSiswa, tipe, nilai, catatan}
     * @returns {boolean}
     */
    tambahNilaiTugasMandiri(data) {
        try {
            if (!data.idSiswa || !data.tipe || data.nilai === undefined) {
                throw new Error('Data tugas mandiri tidak lengkap');
            }

            if (data.nilai < 0 || data.nilai > 100) {
                throw new Error('Nilai harus antara 0-100');
            }

            const nilaiObj = {
                id: this.generateId(),
                idSiswa: data.idSiswa,
                tipe: data.tipe,
                nilai: parseFloat(data.nilai),
                catatan: data.catatan || '',
                tanggal: new Date().toISOString()
            };

            this.nilaiTugasMandiri.push(nilaiObj);
            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error menambah nilai tugas mandiri:', error.message);
            return false;
        }
    }

    /**
     * Dapatkan nilai tugas mandiri siswa
     * @param {string} idSiswa - ID siswa
     * @returns {Array} - Daftar nilai tugas mandiri
     */
    getNilaiTugasMandiri(idSiswa = null) {
        if (idSiswa) {
            return this.nilaiTugasMandiri.filter(n => n.idSiswa === idSiswa);
        }
        return this.nilaiTugasMandiri;
    }

    /**
     * Hitung rata-rata tugas mandiri
     * @param {string} idSiswa - ID siswa
     * @returns {number} - Rata-rata nilai
     */
    hitungRataRataTugasMandiri(idSiswa) {
        const nilai = this.getNilaiTugasMandiri(idSiswa);
        if (nilai.length === 0) return 0;
        const total = nilai.reduce((sum, n) => sum + n.nilai, 0);
        return parseFloat((total / nilai.length).toFixed(2));
    }

    /**
     * ============================================================================
     * PENILAIAN TUGAS KELOMPOK
     * ============================================================================
     */

    /**
     * Tambah nilai tugas kelompok
     * @param {Object} data - {idSiswa, tipe, nilai, catatan}
     * @returns {boolean}
     */
    tambahNilaiTugasKelompok(data) {
        try {
            if (!data.idSiswa || !data.tipe || data.nilai === undefined) {
                throw new Error('Data tugas kelompok tidak lengkap');
            }

            if (data.nilai < 0 || data.nilai > 100) {
                throw new Error('Nilai harus antara 0-100');
            }

            const nilaiObj = {
                id: this.generateId(),
                idSiswa: data.idSiswa,
                tipe: data.tipe,
                nilai: parseFloat(data.nilai),
                catatan: data.catatan || '',
                tanggal: new Date().toISOString()
            };

            this.nilaiTugasKelompok.push(nilaiObj);
            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error menambah nilai tugas kelompok:', error.message);
            return false;
        }
    }

    /**
     * Dapatkan nilai tugas kelompok siswa
     * @param {string} idSiswa - ID siswa
     * @returns {Array} - Daftar nilai tugas kelompok
     */
    getNilaiTugasKelompok(idSiswa = null) {
        if (idSiswa) {
            return this.nilaiTugasKelompok.filter(n => n.idSiswa === idSiswa);
        }
        return this.nilaiTugasKelompok;
    }

    /**
     * Hitung rata-rata tugas kelompok
     * @param {string} idSiswa - ID siswa
     * @returns {number} - Rata-rata nilai
     */
    hitungRataRataTugasKelompok(idSiswa) {
        const nilai = this.getNilaiTugasKelompok(idSiswa);
        if (nilai.length === 0) return 0;
        const total = nilai.reduce((sum, n) => sum + n.nilai, 0);
        return parseFloat((total / nilai.length).toFixed(2));
    }

    /**
     * ============================================================================
     * PERHITUNGAN NILAI AKHIR
     * ============================================================================
     */

    /**
     * Hitung nilai akhir siswa berdasarkan semua komponen
     * @param {string} idSiswa - ID siswa
     * @returns {number} - Nilai akhir
     */
    hitungNilaiAkhir(idSiswa) {
        const nilaiUlangan = this.hitungRataRataUlanganHarian(idSiswa);
        const nilaiSumatifAvg = this.hitungRataRataSumatif(idSiswa);
        const nilaiUjian = this.getNilaiUjianAkhir(idSiswa)?.nilai || 0;
        const nilaiPraktek = this.hitungRataRataTugasPraktek(idSiswa);
        const nilaiLKS = this.hitungRataRataTugasLKS(idSiswa);
        const nilaiMandiri = this.hitungRataRataTugasMandiri(idSiswa);
        const nilaiKelompok = this.hitungRataRataTugasKelompok(idSiswa);

        const nilaiAkhir =
            (nilaiUlangan * this.bobot.ulangan / 100) +
            (nilaiSumatifAvg * this.bobot.sumatif / 100) +
            (nilaiUjian * this.bobot.ujian / 100) +
            (nilaiPraktek * this.bobot.praktek / 100) +
            (nilaiLKS * this.bobot.lks / 100) +
            (nilaiMandiri * this.bobot.mandiri / 100) +
            (nilaiKelompok * this.bobot.kelompok / 100);

        return parseFloat(nilaiAkhir.toFixed(2));
    }

    /**
     * Tentukan grade berdasarkan nilai
     * @param {number} nilai - Nilai siswa
     * @returns {string} - Grade (A, B, C, D)
     */
    tentukan​Grade(nilai) {
        if (nilai >= this.kriteria.nilaiA) return 'A';
        if (nilai >= this.kriteria.nilaiB) return 'B';
        if (nilai >= this.kriteria.nilaiC) return 'C';
        return 'D';
    }

    /**
     * Tentukan status ketuntasan
     * @param {number} nilai - Nilai siswa
     * @returns {string} - Status (Tuntas/Tidak Tuntas)
     */
    tentukanStatus(nilai) {
        return nilai >= this.kriteria.kkm ? 'Tuntas' : 'Tidak Tuntas';
    }

    /**
     * ============================================================================
     * REKAP PENILAIAN
     * ============================================================================
     */

    /**
     * Dapatkan rekap nilai lengkap untuk semua siswa
     * @returns {Array} - Daftar rekap penilaian
     */
    getRekapNilaiLengkap() {
        return this.daftarSiswa.map(siswa => {
            const nilaiAkhir = this.hitungNilaiAkhir(siswa.id);
            return {
                id: siswa.id,
                nama: siswa.nama,
                nis: siswa.nis,
                kelas: siswa.kelas,
                absen: siswa.absen,
                nilaiUlangan: this.hitungRataRataUlanganHarian(siswa.id),
                nilaiSumatif: this.hitungRataRataSumatif(siswa.id),
                nilaiUjian: this.getNilaiUjianAkhir(siswa.id)?.nilai || 0,
                nilaiPraktek: this.hitungRataRataTugasPraktek(siswa.id),
                nilaiLKS: this.hitungRataRataTugasLKS(siswa.id),
                nilaiMandiri: this.hitungRataRataTugasMandiri(siswa.id),
                nilaiKelompok: this.hitungRataRataTugasKelompok(siswa.id),
                nilaiAkhir: nilaiAkhir,
                grade: this.tentukanGrade(nilaiAkhir),
                status: this.tentukanStatus(nilaiAkhir)
            };
        });
    }

    /**
     * ============================================================================
     * MANAJEMEN BOBOT
     * ============================================================================
     */

    /**
     * Set bobot penilaian
     * @param {Object} bobotBaru - Bobot penilaian baru
     * @returns {boolean}
     */
    setBobotPenilaian(bobotBaru) {
        try {
            // Validasi total bobot = 100%
            const totalBobot = Object.values(bobotBaru).reduce((a, b) => a + b, 0);
            if (totalBobot !== 100) {
                throw new Error(`Total bobot harus 100%, saat ini ${totalBobot}%`);
            }

            this.bobot = {
                ulangan: bobotBaru.ulangan || this.bobot.ulangan,
                sumatif: bobotBaru.sumatif || this.bobot.sumatif,
                ujian: bobotBaru.ujian || this.bobot.ujian,
                praktek: bobotBaru.praktek || this.bobot.praktek,
                lks: bobotBaru.lks || this.bobot.lks,
                mandiri: bobotBaru.mandiri || this.bobot.mandiri,
                kelompok: bobotBaru.kelompok || this.bobot.kelompok
            };

            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error set bobot:', error.message);
            return false;
        }
    }

    /**
     * Dapatkan bobot penilaian
     * @returns {Object} - Bobot penilaian
     */
    getBobot() {
        return this.bobot;
    }

    /**
     * ============================================================================
     * MANAJEMEN KRITERIA
     * ============================================================================
     */

    /**
     * Set kriteria penilaian
     * @param {Object} kriteriaBaru - Kriteria penilaian baru
     * @returns {boolean}
     */
    setKriteria(kriteriaBaru) {
        try {
            this.kriteria = {
                kkm: kriteriaBaru.kkm || this.kriteria.kkm,
                nilaiA: kriteriaBaru.nilaiA || this.kriteria.nilaiA,
                nilaiB: kriteriaBaru.nilaiB || this.kriteria.nilaiB,
                nilaiC: kriteriaBaru.nilaiC || this.kriteria.nilaiC
            };

            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error set kriteria:', error.message);
            return false;
        }
    }

    /**
     * Dapatkan kriteria penilaian
     * @returns {Object} - Kriteria penilaian
     */
    getKriteria() {
        return this.kriteria;
    }

    /**
     * ============================================================================
     * STATISTIK DAN ANALISIS
     * ============================================================================
     */

    /**
     * Hitung statistik nilai
     * @param {string} jenisNilai - Jenis nilai (ulangan, sumatif, ujian, dll)
     * @returns {Object} - Statistik nilai
     */
    hitungStatistikNilai(jenisNilai) {
        let daftarNilai = [];

        switch (jenisNilai) {
            case 'ulangan':
                daftarNilai = this.nilaiUlanganHarian.map(n => n.nilai);
                break;
            case 'sumatif':
                daftarNilai = this.nilaiSumatif.map(n => n.nilai);
                break;
            case 'ujian':
                daftarNilai = this.nilaiUjianAkhir.map(n => n.nilai);
                break;
            case 'praktek':
                daftarNilai = this.nilaiTugasPraktek.map(n => n.nilai);
                break;
            case 'lks':
                daftarNilai = this.nilaiTugasLKS.map(n => n.nilai);
                break;
            case 'mandiri':
                daftarNilai = this.nilaiTugasMandiri.map(n => n.nilai);
                break;
            case 'kelompok':
                daftarNilai = this.nilaiTugasKelompok.map(n => n.nilai);
                break;
        }

        if (daftarNilai.length === 0) {
            return {
                total: 0,
                rata: 0,
                tertinggi: 0,
                terendah: 0,
                standarDeviasi: 0
            };
        }

        const total = daftarNilai.length;
        const rata = daftarNilai.reduce((a, b) => a + b) / total;
        const tertinggi = Math.max(...daftarNilai);
        const terendah = Math.min(...daftarNilai);
        const standarDeviasi = Math.sqrt(
            daftarNilai.reduce((sum, val) => sum + Math.pow(val - rata, 2), 0) / total
        );

        return {
            total,
            rata: parseFloat(rata.toFixed(2)),
            tertinggi,
            terendah,
            standarDeviasi: parseFloat(standarDeviasi.toFixed(2))
        };
    }

    /**
     * Dapatkan siswa dengan nilai tertinggi
     * @param {number} limit - Jumlah siswa
     * @returns {Array} - Daftar siswa terbaik
     */
    getSiswaTerbaik(limit = 5) {
        const rekap = this.getRekapNilaiLengkap();
        return rekap
            .sort((a, b) => b.nilaiAkhir - a.nilaiAkhir)
            .slice(0, limit);
    }

    /**
     * Dapatkan siswa yang memerlukan perbaikan
     * @param {number} limit - Jumlah siswa
     * @returns {Array} - Daftar siswa yang perlu perbaikan
     */
    getSiswaPerbaikan(limit = 5) {
        const rekap = this.getRekapNilaiLengkap();
        return rekap
            .filter(s => s.status === 'Tidak Tuntas')
            .sort((a, b) => a.nilaiAkhir - b.nilaiAkhir)
            .slice(0, limit);
    }

    /**
     * ============================================================================
     * UTILITY METHODS
     * ============================================================================
     */

    /**
     * Generate ID unik
     * @returns {string} - ID unik
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Reset semua data
     * @returns {boolean}
     */
    resetAllData() {
        if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak bisa dibatalkan.')) {
            this.daftarSiswa = [];
            this.nilaiUlanganHarian = [];
            this.nilaiSumatif = [];
            this.nilaiUjianAkhir = [];
            this.nilaiTugasPraktek = [];
            this.nilaiTugasLKS = [];
            this.nilaiTugasMandiri = [];
            this.nilaiTugasKelompok = [];
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    /**
     * ============================================================================
     * LOCAL STORAGE MANAGEMENT
     * ============================================================================
     */

    /**
     * Simpan semua data ke localStorage
     */
    saveToLocalStorage() {
        const dataToSave = {
            daftarSiswa: this.daftarSiswa,
            nilaiUlanganHarian: this.nilaiUlanganHarian,
            nilaiSumatif: this.nilaiSumatif,
            nilaiUjianAkhir: this.nilaiUjianAkhir,
            nilaiTugasPraktek: this.nilaiTugasPraktek,
            nilaiTugasLKS: this.nilaiTugasLKS,
            nilaiTugasMandiri: this.nilaiTugasMandiri,
            nilaiTugasKelompok: this.nilaiTugasKelompok,
            bobot: this.bobot,
            kriteria: this.kriteria,
            lastSaved: new Date().toISOString()
        };

        localStorage.setItem('penilaianData', JSON.stringify(dataToSave));
    }

    /**
     * Load data dari localStorage
     */
    loadFromLocalStorage() {
        const data = localStorage.getItem('penilaianData');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.daftarSiswa = parsed.daftarSiswa || [];
                this.nilaiUlanganHarian = parsed.nilaiUlanganHarian || [];
                this.nilaiSumatif = parsed.nilaiSumatif || [];
                this.nilaiUjianAkhir = parsed.nilaiUjianAkhir || [];
                this.nilaiTugasPraktek = parsed.nilaiTugasPraktek || [];
                this.nilaiTugasLKS = parsed.nilaiTugasLKS || [];
                this.nilaiTugasMandiri = parsed.nilaiTugasMandiri || [];
                this.nilaiTugasKelompok = parsed.nilaiTugasKelompok || [];
                this.bobot = parsed.bobot || this.bobot;
                this.kriteria = parsed.kriteria || this.kriteria;
            } catch (error) {
                console.error('Error loading data from localStorage:', error);
            }
        }
    }

    /**
     * Export data ke JSON
     * @returns {string} - JSON string
     */
    exportToJSON() {
        return JSON.stringify({
            daftarSiswa: this.daftarSiswa,
            nilaiUlanganHarian: this.nilaiUlanganHarian,
            nilaiSumatif: this.nilaiSumatif,
            nilaiUjianAkhir: this.nilaiUjianAkhir,
            nilaiTugasPraktek: this.nilaiTugasPraktek,
            nilaiTugasLKS: this.nilaiTugasLKS,
            nilaiTugasMandiri: this.nilaiTugasMandiri,
            nilaiTugasKelompok: this.nilaiTugasKelompok,
            bobot: this.bobot,
            kriteria: this.kriteria,
            exportDate: new Date().toISOString()
        }, null, 2);
    }

    /**
     * Import data dari JSON
     * @param {string} jsonData - JSON string
     * @returns {boolean}
     */
    importFromJSON(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.daftarSiswa = data.daftarSiswa || [];
            this.nilaiUlanganHarian = data.nilaiUlanganHarian || [];
            this.nilaiSumatif = data.nilaiSumatif || [];
            this.nilaiUjianAkhir = data.nilaiUjianAkhir || [];
            this.nilaiTugasPraktek = data.nilaiTugasPraktek || [];
            this.nilaiTugasLKS = data.nilaiTugasLKS || [];
            this.nilaiTugasMandiri = data.nilaiTugasMandiri || [];
            this.nilaiTugasKelompok = data.nilaiTugasKelompok || [];
            this.bobot = data.bobot || this.bobot;
            this.kriteria = data.kriteria || this.kriteria;
            this.saveToLocalStorage();
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Export untuk penggunaan di module lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Penilaian;
}