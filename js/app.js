/**
 * ============================================================================
 * APLIKASI PENILAIAN SISWA - Main Application Logic
 * ============================================================================
 * 
 * File ini berisi semua logika aplikasi untuk mengelola antarmuka pengguna,
 * event handling, dan integrasi dengan kelas Penilaian.
 * 
 * Author: Sistem Penilaian Siswa
 * Version: 1.0.0
 * ============================================================================
 */

// Inisialisasi instance Penilaian
const penilaian = new Penilaian();
let daftarSiswaSelect = [];

/**
 * ============================================================================
 * EVENT LISTENERS - NAVIGASI
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    loadSampleData();
    updateDashboard();
});

/**
 * Inisialisasi aplikasi
 */
function initializeApp() {
    // Setup navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            navigateTo(sectionId);
        });
    });

    // Menu toggle untuk mobile
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    // Close modal when clicking overlay
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeAllModals);
    }
}

/**
 * Navigasi ke section tertentu
 * @param {string} sectionId - ID section yang dituju
 */
function navigateTo(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'nilai-ulangan': 'Penilaian Ulangan Harian',
        'nilai-sumatif': 'Penilaian Sumatif',
        'nilai-ujian': 'Ujian Akhir',
        'tugas-praktek': 'Tugas Praktik',
        'tugas-lks': 'Tugas LKS',
        'tugas-mandiri': 'Tugas Mandiri',
        'tugas-kelompok': 'Tugas Kelompok',
        'rekap': 'Rekap Nilai Akhir',
        'pengaturan': 'Pengaturan Sistem'
    };

    document.getElementById('pageTitle').textContent = titles[sectionId] || 'Dashboard';

    // Load data untuk section
    switch (sectionId) {
        case 'nilai-ulangan':
            loadTabelUlanganHarian();
            break;
        case 'nilai-sumatif':
            loadTabelSumatif();
            break;
        case 'nilai-ujian':
            loadTabelUjian();
            break;
        case 'tugas-praktek':
            loadTabelTugasPraktek();
            break;
        case 'tugas-lks':
            loadTabelTugasLKS();
            break;
        case 'tugas-mandiri':
            loadTabelTugasMandiri();
            break;
        case 'tugas-kelompok':
            loadTabelTugasKelompok();
            break;
        case 'rekap':
            loadTabelRekap();
            break;
        case 'pengaturan':
            loadPengaturan();
            break;
        case 'dashboard':
            updateDashboard();
            break;
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.left = sidebar.style.left === '0px' ? '-260px' : '0px';
}

/**
 * ============================================================================
 * MODAL MANAGEMENT
 * ============================================================================
 */

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.style.display = 'block';
        populateStudentSelects();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
    checkAllModalsClosed();
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('active'));
    document.getElementById('modalOverlay').style.display = 'none';
}

function checkAllModalsClosed() {
    const activeModals = document.querySelectorAll('.modal.active');
    if (activeModals.length === 0) {
        document.getElementById('modalOverlay').style.display = 'none';
    }
}

/**
 * ============================================================================
 * DASHBOARD
 * ============================================================================
 */

function updateDashboard() {
    const siswaList = penilaian.getDaftarSiswa();
    const rekap = penilaian.getRekapNilaiLengkap();

    // Update stat cards
    document.getElementById('totalSiswa').textContent = siswaList.length;

    const rataRata = rekap.length > 0
        ? parseFloat((rekap.reduce((sum, s) => sum + s.nilaiAkhir, 0) / rekap.length).toFixed(2))
        : 0;
    document.getElementById('rataRataNilai').textContent = rataRata;

    const perbaikan = rekap.filter(s => s.status === 'Tidak Tuntas').length;
    document.getElementById('perbaikanDiperlukan').textContent = perbaikan;

    const tuntas = rekap.filter(s => s.status === 'Tuntas').length;
    document.getElementById('siswaTuntas').textContent = tuntas;

    // Update charts
    updateCharts(rekap);

    // Update activity list
    updateActivityList();
}

function updateCharts(rekap) {
    // Distribution Chart
    const ctx1 = document.getElementById('distributionChart');
    if (ctx1) {
        const chartData = {
            'A (85-100)': rekap.filter(s => s.grade === 'A').length,
            'B (75-84)': rekap.filter(s => s.grade === 'B').length,
            'C (60-74)': rekap.filter(s => s.grade === 'C').length,
            'D (<60)': rekap.filter(s => s.grade === 'D').length
        };

        if (window.distributionChart) {
            window.distributionChart.destroy();
        }

        window.distributionChart = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: Object.keys(chartData),
                datasets: [{
                    label: 'Jumlah Siswa',
                    data: Object.values(chartData),
                    backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#f44336'],
                    borderColor: ['#45a049', '#0b7dda', '#e68900', '#da190b'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: Math.ceil(rekap.length / 2) || 5
                    }
                }
            }
        });
    }

    // Comparison Chart
    const ctx2 = document.getElementById('comparisonChart');
    if (ctx2) {
        const avgByType = {
            'Ulangan': rekap.length > 0 ? parseFloat((rekap.reduce((sum, s) => sum + s.nilaiUlangan, 0) / rekap.length).toFixed(2)) : 0,
            'Sumatif': rekap.length > 0 ? parseFloat((rekap.reduce((sum, s) => sum + s.nilaiSumatif, 0) / rekap.length).toFixed(2)) : 0,
            'Ujian': rekap.length > 0 ? parseFloat((rekap.reduce((sum, s) => sum + s.nilaiUjian, 0) / rekap.length).toFixed(2)) : 0,
            'Praktik': rekap.length > 0 ? parseFloat((rekap.reduce((sum, s) => sum + s.nilaiPraktek, 0) / rekap.length).toFixed(2)) : 0,
            'LKS': rekap.length > 0 ? parseFloat((rekap.reduce((sum, s) => sum + s.nilaiLKS, 0) / rekap.length).toFixed(2)) : 0,
            'Mandiri': rekap.length > 0 ? parseFloat((rekap.reduce((sum, s) => sum + s.nilaiMandiri, 0) / rekap.length).toFixed(2)) : 0,
            'Kelompok': rekap.length > 0 ? parseFloat((rekap.reduce((sum, s) => sum + s.nilaiKelompok, 0) / rekap.length).toFixed(2)) : 0
        };

        if (window.comparisonChart) {
            window.comparisonChart.destroy();
        }

        window.comparisonChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: Object.keys(avgByType),
                datasets: [{
                    label: 'Rata-rata Nilai',
                    data: Object.values(avgByType),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

function updateActivityList() {
    const activityList = document.getElementById('activityList');
    const activities = [
        { icon: 'fa-plus-circle', text: 'Nilai baru ditambahkan', time: 'Baru saja' },
        { icon: 'fa-edit', text: 'Data siswa diperbarui', time: '5 menit lalu' },
        { icon: 'fa-check', text: 'Penilaian sumatif selesai', time: '1 jam lalu' },
        { icon: 'fa-users', text: 'Tugas kelompok dinilai', time: '3 jam lalu' },
        { icon: 'fa-file-export', text: 'Data diekspor ke Excel', time: 'Kemarin' }
    ];

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-text">
                <p>${activity.text}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

/**
 * ============================================================================
 * POPULATE STUDENT SELECTS
 * ============================================================================
 */

function populateStudentSelects() {
    const siswaList = penilaian.getDaftarSiswa();
    const selectElements = document.querySelectorAll('[id$="Siswa"], [id$="Ulangan"], [id$="Sumatif"], [id$="Ujian"], [id$="Praktek"], [id$="LKS"], [id$="Mandiri"], [id$="Kelompok"]');

    selectElements.forEach(select => {
        if (select.tagName === 'SELECT' && select.id.includes('siswa')) {
            select.innerHTML = '<option value="">-- Pilih Siswa --</option>' +
                siswaList.map(siswa => `<option value="${siswa.id}">${siswa.nama}</option>`).join('');
        }
    });
}

/**
 * ============================================================================
 * ULANGAN HARIAN
 * ============================================================================
 */

function loadTabelUlanganHarian() {
    const tbody = document.getElementById('tabelUlanganHarian');
    const siswaList = penilaian.getDaftarSiswa();

    tbody.innerHTML = siswaList.map((siswa, index) => {
        const nilai = penilaian.getNilaiUlanganHarian(siswa.id);
        const nilai1 = nilai.find(n => n.tipe === '1')?.nilai || '-';
        const nilai2 = nilai.find(n => n.tipe === '2')?.nilai || '-';
        const nilai3 = nilai.find(n => n.tipe === '3')?.nilai || '-';
        const rataRata = penilaian.hitungRataRataUlanganHarian(siswa.id);

        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${siswa.nama}</strong></td>
                <td>${nilai1}</td>
                <td>${nilai2}</td>
                <td>${nilai3}</td>
                <td><strong>${rataRata > 0 ? rataRata : '-'}</strong></td>
                <td>
                    <button class="btn btn-primary btn-small" onclick="editUlanganHarian('${siswa.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editUlanganHarian(idSiswa) {
    const siswa = penilaian.getSiswaById(idSiswa);
    document.getElementById('siswaUlangan').value = idSiswa;
    openModal('modalUlanganHarian');
}

function simpanUlanganHarian() {
    const idSiswa = document.getElementById('siswaUlangan').value;
    const tipe = document.getElementById('tipeUlangan').value;
    const nilai = document.getElementById('nilaiUlangan').value;
    const catatan = document.getElementById('catatanUlangan').value;

    if (penilaian.tambahNilaiUlanganHarian({ idSiswa, tipe, nilai, catatan })) {
        showNotification('Nilai ulangan harian berhasil disimpan', 'success');
        closeModal('modalUlanganHarian');
        loadTabelUlanganHarian();
        updateDashboard();
        document.getElementById('formUlanganHarian').reset();
    } else {
        showNotification('Gagal menyimpan nilai ulangan harian', 'error');
    }
}

/**
 * ============================================================================
 * SUMATIF
 * ============================================================================
 */

function loadTabelSumatif() {
    const tbody = document.getElementById('tabelSumatif');
    const siswaList = penilaian.getDaftarSiswa();

    tbody.innerHTML = siswaList.map((siswa, index) => {
        const nilai = penilaian.getNilaiSumatif(siswa.id);
        const nilai1 = nilai.find(n => n.tipe === '1')?.nilai || '-';
        const nilai2 = nilai.find(n => n.tipe === '2')?.nilai || '-';
        const nilai3 = nilai.find(n => n.tipe === '3')?.nilai || '-';
        const rataRata = penilaian.hitungRataRataSumatif(siswa.id);

        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${siswa.nama}</strong></td>
                <td>${nilai1}</td>
                <td>${nilai2}</td>
                <td>${nilai3}</td>
                <td><strong>${rataRata > 0 ? rataRata : '-'}</strong></td>
                <td>
                    <button class="btn btn-primary btn-small" onclick="editSumatif('${siswa.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editSumatif(idSiswa) {
    document.getElementById('siswaSumatif').value = idSiswa;
    openModal('modalSumatif');
}

function simpanSumatif() {
    const idSiswa = document.getElementById('siswaSumatif').value;
    const tipe = document.getElementById('tipeSumatif').value;
    const nilai = document.getElementById('nilaiSumatif').value;
    const catatan = document.getElementById('catatanSumatif').value;

    if (penilaian.tambahNilaiSumatif({ idSiswa, tipe, nilai, catatan })) {
        showNotification('Nilai sumatif berhasil disimpan', 'success');
        closeModal('modalSumatif');
        loadTabelSumatif();
        updateDashboard();
        document.getElementById('formSumatif').reset();
    } else {
        showNotification('Gagal menyimpan nilai sumatif', 'error');
    }
}

/**
 * ============================================================================
 * UJIAN AKHIR
 * ============================================================================
 */

function loadTabelUjian() {
    const tbody = document.getElementById('tabelUjian');
    const siswaList = penilaian.getDaftarSiswa();

    tbody.innerHTML = siswaList.map((siswa, index) => {
        const nilai = penilaian.getNilaiUjianAkhir(siswa.id);
        const nilaiUjian = nilai?.nilai || '-';
        const keterangan = nilai ? (nilaiUjian >= penilaian.kriteria.kkm ? 'Lulus' : 'Tidak Lulus') : '-';

        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${siswa.nama}</strong></td>
                <td><strong>${nilaiUjian}</strong></td>
                <td>${keterangan}</td>
                <td>
                    <button class="btn btn-primary btn-small" onclick="editUjian('${siswa.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editUjian(idSiswa) {
    document.getElementById('siswaUjian').value = idSiswa;
    openModal('modalUjian');
}

function simpanUjian() {
    const idSiswa = document.getElementById('siswaUjian').value;
    const nilai = document.getElementById('nilaiUjianAkhir').value;
    const tanggalUjian = document.getElementById('tanggalUjian').value;
    const catatan = document.getElementById('catatanUjian').value;

    if (penilaian.tambahNilaiUjianAkhir({ idSiswa, nilai, tanggalUjian, catatan })) {
        showNotification('Nilai ujian akhir berhasil disimpan', 'success');
        closeModal('modalUjian');
        loadTabelUjian();
        updateDashboard();
        document.getElementById('formUjian').reset();
    } else {
        showNotification('Gagal menyimpan nilai ujian akhir', 'error');
    }
}

/**
 * ============================================================================
 * TUGAS PRAKTIK
 * ============================================================================
 */

function loadTabelTugasPraktek() {
    const tbody = document.getElementById('tabelTugasPraktek');
    const siswaList = penilaian.getDaftarSiswa();

    tbody.innerHTML = siswaList.map((siswa, index) => {
        const nilai = penilaian.getNilaiTugasPraktek(siswa.id);
        const nilai1 = nilai.find(n => n.tipe === '1')?.nilai || '-';
        const nilai2 = nilai.find(n => n.tipe === '2')?.nilai || '-';
        const nilai3 = nilai.find(n => n.tipe === '3')?.nilai || '-';
        const rataRata = penilaian.hitungRataRataTugasPraktek(siswa.id);

        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${siswa.nama}</strong></td>
                <td>${nilai1}</td>
                <td>${nilai2}</td>
                <td>${nilai3}</td>
                <td><strong>${rataRata > 0 ? rataRata : '-'}</strong></td>
                <td>
                    <button class="btn btn-primary btn-small" onclick="editTugasPraktek('${siswa.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editTugasPraktek(idSiswa) {
    document.getElementById('siswaTugasPraktek').value = idSiswa;
    openModal('modalTugasPraktek');
}

function simpanTugasPraktek() {
    const idSiswa = document.getElementById('siswaTugasPraktek').value;
    const tipe = document.getElementById('tipePraktek').value;
    const nilai = document.getElementById('nilaiPraktek').value;
    const catatan = document.getElementById('catatanPraktek').value;

    if (penilaian.tambahNilaiTugasPraktek({ idSiswa, tipe, nilai, catatan })) {
        showNotification('Nilai tugas praktik berhasil disimpan', 'success');
        closeModal('modalTugasPraktek');
        loadTabelTugasPraktek();
        updateDashboard();
        document.getElementById('formTugasPraktek').reset();
    } else {
        showNotification('Gagal menyimpan nilai tugas praktik', 'error');
    }
}

/**
 * ============================================================================
 * TUGAS LKS
 * ============================================================================
 */

function loadTabelTugasLKS() {
    const tbody = document.getElementById('tabelTugasLKS');
    const siswaList = penilaian.getDaftarSiswa();

    tbody.innerHTML = siswaList.map((siswa, index) => {
        const nilai = penilaian.getNilaiTugasLKS(siswa.id);
        const nilai1 = nilai.find(n => n.tipe === '1')?.nilai || '-';
        const nilai2 = nilai.find(n => n.tipe === '2')?.nilai || '-';
        const nilai3 = nilai.find(n => n.tipe === '3')?.nilai || '-';
        const rataRata = penilaian.hitungRataRataTugasLKS(siswa.id);

        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${siswa.nama}</strong></td>
                <td>${nilai1}</td>
                <td>${nilai2}</td>
                <td>${nilai3}</td>
                <td><strong>${rataRata > 0 ? rataRata : '-'}</strong></td>
                <td>
                    <button class="btn btn-primary btn-small" onclick="editTugasLKS('${siswa.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editTugasLKS(idSiswa) {
    document.getElementById('siswaTugasLKS').value = idSiswa;
    openModal('modalTugasLKS');
}

function simpanTugasLKS() {
    const idSiswa = document.getElementById('siswaTugasLKS').value;
    const tipe = document.getElementById('tipeLKS').value;
    const nilai = document.getElementById('nilaiLKS').value;
    const catatan = document.getElementById('catatanLKS').value;

    if (penilaian.tambahNilaiTugasLKS({ idSiswa, tipe, nilai, catatan })) {
        showNotification('Nilai tugas LKS berhasil disimpan', 'success');
        closeModal('modalTugasLKS');
        loadTabelTugasLKS();
        updateDashboard();
        document.getElementById('formTugasLKS').reset();
    } else {
        showNotification('Gagal menyimpan nilai tugas LKS', 'error');
    }
}

/**
 * ============================================================================
 * TUGAS MANDIRI
 * ============================================================================
 */

function loadTabelTugasMandiri() {
    const tbody = document.getElementById('tabelTugasMandiri');
    const siswaList = penilaian.getDaftarSiswa();

    tbody.innerHTML = siswaList.map((siswa, index) => {
        const nilai = penilaian.getNilaiTugasMandiri(siswa.id);
        const nilai1 = nilai.find(n => n.tipe === '1')?.nilai || '-';
        const nilai2 = nilai.find(n => n.tipe === '2')?.nilai || '-';
        const nilai3 = nilai.find(n => n.tipe === '3')?.nilai || '-';
        const rataRata = penilaian.hitungRataRataTugasMandiri(siswa.id);

        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${siswa.nama}</strong></td>
                <td>${nilai1}</td>
                <td>${nilai2}</td>
                <td>${nilai3}</td>
                <td><strong>${rataRata > 0 ? rataRata : '-'}</strong></td>
                <td>
                    <button class="btn btn-primary btn-small" onclick="editTugasMandiri('${siswa.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editTugasMandiri(idSiswa) {
    document.getElementById('siswaTugasMandiri').value = idSiswa;
    openModal('modalTugasMandiri');
}

function simpanTugasMandiri() {
    const idSiswa = document.getElementById('siswaTugasMandiri').value;
    const tipe = document.getElementById('tipeMandiri').value;
    const nilai = document.getElementById('nilaiMandiri').value;
    const catatan = document.getElementById('catatanMandiri').value;

    if (penilaian.tambahNilaiTugasMandiri({ idSiswa, tipe, nilai, catatan })) {
        showNotification('Nilai tugas mandiri berhasil disimpan', 'success');
        closeModal('modalTugasMandiri');
        loadTabelTugasMandiri();
        updateDashboard();
        document.getElementById('formTugasMandiri').reset();
    } else {
        showNotification('Gagal menyimpan nilai tugas mandiri', 'error');
    }
}

/**
 * ============================================================================
 * TUGAS KELOMPOK
 * ============================================================================
 */

function loadTabelTugasKelompok() {
    const tbody = document.getElementById('tabelTugasKelompok');
    const siswaList = penilaian.getDaftarSiswa();

    tbody.innerHTML = siswaList.map((siswa, index) => {
        const nilai = penilaian.getNilaiTugasKelompok(siswa.id);
        const nilai1 = nilai.find(n => n.tipe === '1')?.nilai || '-';
        const nilai2 = nilai.find(n => n.tipe === '2')?.nilai || '-';
        const nilai3 = nilai.find(n => n.tipe === '3')?.nilai || '-';
        const rataRata = penilaian.hitungRataRataTugasKelompok(siswa.id);

        return `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${siswa.nama}</strong></td>
                <td>${nilai1}</td>
                <td>${nilai2}</td>
                <td>${nilai3}</td>
                <td><strong>${rataRata > 0 ? rataRata : '-'}</strong></td>
                <td>
                    <button class="btn btn-primary btn-small" onclick="editTugasKelompok('${siswa.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function editTugasKelompok(idSiswa) {
    document.getElementById('siswaTugasKelompok').value = idSiswa;
    openModal('modalTugasKelompok');
}

function simpanTugasKelompok() {
    const idSiswa = document.getElementById('siswaTugasKelompok').value;
    const tipe = document.getElementById('tipeKelompok').value;
    const nilai = document.getElementById('nilaiKelompok').value;
    const catatan = document.getElementById('catatanKelompok').value;

    if (penilaian.tambahNilaiTugasKelompok({ idSiswa, tipe, nilai, catatan })) {
        showNotification('Nilai tugas kelompok berhasil disimpan', 'success');
        closeModal('modalTugasKelompok');
        loadTabelTugasKelompok();
        updateDashboard();
        document.getElementById('formTugasKelompok').reset();
    } else {
        showNotification('Gagal menyimpan nilai tugas kelompok', 'error');
    }
}

/**
 * ============================================================================
 * REKAP NILAI
 * ============================================================================
 */

function loadTabelRekap() {
    const tbody = document.getElementById('tabelRekap');
    const rekap = penilaian.getRekapNilaiLengkap();

    tbody.innerHTML = rekap.map((siswa, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${siswa.nama}</strong></td>
            <td>${siswa.nilaiUlangan > 0 ? siswa.nilaiUlangan : '-'}</td>
            <td>${siswa.nilaiSumatif > 0 ? siswa.nilaiSumatif : '-'}</td>
            <td>${siswa.nilaiUjian > 0 ? siswa.nilaiUjian : '-'}</td>
            <td>${siswa.nilaiPraktek > 0 ? siswa.nilaiPraktek : '-'}</td>
            <td>${siswa.nilaiLKS > 0 ? siswa.nilaiLKS : '-'}</td>
            <td>${siswa.nilaiMandiri > 0 ? siswa.nilaiMandiri : '-'}</td>
            <td>${siswa.nilaiKelompok > 0 ? siswa.nilaiKelompok : '-'}</td>
            <td><strong class="nilai-cell">${siswa.nilaiAkhir}</strong></td>
            <td><span class="grade ${siswa.grade.toLowerCase()}">${siswa.grade}</span></td>
            <td><span class="status-badge ${siswa.status === 'Tuntas' ? 'tuntas' : 'tidak-tuntas'}">${siswa.status}</span></td>
        </tr>
    `).join('');
}

/**
 * ============================================================================
 * PENGATURAN
 * ============================================================================
 */

function loadPengaturan() {
    // Load bobot
    const bobot = penilaian.getBobot();
    document.getElementById('bobotUlangan').value = bobot.ulangan;
    document.getElementById('bobotSumatif').value = bobot.sumatif;
    document.getElementById('bobotUjian').value = bobot.ujian;
    document.getElementById('bobotPraktek').value = bobot.praktek;
    document.getElementById('bobotLKS').value = bobot.lks;
    document.getElementById('bobotMandiri').value = bobot.mandiri;
    document.getElementById('bobotKelompok').value = bobot.kelompok;

    // Load kriteria
    const kriteria = penilaian.getKriteria();
    document.getElementById('kkm').value = kriteria.kkm;
    document.getElementById('nilaiA').value = kriteria.nilaiA;
    document.getElementById('nilaiB').value = kriteria.nilaiB;
    document.getElementById('nilaiC').value = kriteria.nilaiC;

    // Load daftar siswa
    loadDaftarSiswa();
}

function loadDaftarSiswa() {
    const siswaList = penilaian.getDaftarSiswa();
    const daftarSiswaDiv = document.getElementById('daftarSiswa');

    daftarSiswaDiv.innerHTML = siswaList.map(siswa => `
        <div class="siswa-item">
            <div class="siswa-info">
                <strong>${siswa.nama}</strong>
                <p>NIS: ${siswa.nis} | Kelas: ${siswa.kelas} | Absen: ${siswa.absen}</p>
            </div>
            <button class="btn btn-danger btn-small" onclick="hapusSiswaConfirm('${siswa.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function simpanSiswa() {
    const nama = document.getElementById('namaSiswa').value;
    const nis = document.getElementById('nisSiswa').value;
    const kelas = document.getElementById('kelasSiswa').value;
    const absen = document.getElementById('abenSiswa').value;

    if (penilaian.tambahSiswa({ nama, nis, kelas, absen })) {
        showNotification('Siswa berhasil ditambahkan', 'success');
        closeModal('modalTambahSiswa');
        loadDaftarSiswa();
        document.getElementById('formTambahSiswa').reset();
    } else {
        showNotification('Gagal menambahkan siswa', 'error');
    }
}

function hapusSiswaConfirm(idSiswa) {
    if (confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
        penilaian.hapusSiswa(idSiswa);
        showNotification('Siswa berhasil dihapus', 'success');
        loadDaftarSiswa();
    }
}

function simpanPengaturan() {
    const bobot = {
        ulangan: parseFloat(document.getElementById('bobotUlangan').value),
        sumatif: parseFloat(document.getElementById('bobotSumatif').value),
        ujian: parseFloat(document.getElementById('bobotUjian').value),
        praktek: parseFloat(document.getElementById('bobotPraktek').value),
        lks: parseFloat(document.getElementById('bobotLKS').value),
        mandiri: parseFloat(document.getElementById('bobotMandiri').value),
        kelompok: parseFloat(document.getElementById('bobotKelompok').value)
    };

    if (!penilaian.setBobotPenilaian(bobot)) {
        showNotification('Total bobot harus 100%', 'error');
        return;
    }

    const kriteria = {
        kkm: parseFloat(document.getElementById('kkm').value),
        nilaiA: parseFloat(document.getElementById('nilaiA').value),
        nilaiB: parseFloat(document.getElementById('nilaiB').value),
        nilaiC: parseFloat(document.getElementById('nilaiC').value)
    };

    penilaian.setKriteria(kriteria);
    showNotification('Pengaturan berhasil disimpan', 'success');
    updateDashboard();
}

function resetData() {
    if (penilaian.resetAllData()) {
        showNotification('Semua data berhasil direset', 'success');
        loadPengaturan();
        loadTabelRekap();
    }
}

/**
 * ============================================================================
 * EXPORT & IMPORT
 * ============================================================================
 */

function exportToExcel() {
    const rekap = penilaian.getRekapNilaiLengkap();
    let csv = 'No,Nama Siswa,NIS,Kelas,Ulangan,Sumatif,Ujian,Praktik,LKS,Mandiri,Kelompok,Nilai Akhir,Grade,Status\n';

    rekap.forEach((siswa, index) => {
        csv += `${index + 1},"${siswa.nama}","${siswa.nis}","${siswa.kelas}",${siswa.nilaiUlangan},${siswa.nilaiSumatif},${siswa.nilaiUjian},${siswa.nilaiPraktek},${siswa.nilaiLKS},${siswa.nilaiMandiri},${siswa.nilaiKelompok},${siswa.nilaiAkhir},"${siswa.grade}","${siswa.status}"\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `Rekap_Nilai_${new Date().getTime()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showNotification('Data berhasil diekspor ke CSV', 'success');
}

/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 */

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        font-size: 14px;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

function loadSampleData() {
    // Hanya load sample data jika belum ada data
    if (penilaian.getDaftarSiswa().length === 0) {
        const siswaData = [
            { nama: 'Ahmad Riyaldi', nis: '001', kelas: '10A', absen: 1 },
            { nama: 'Budi Santoso', nis: '002', kelas: '10A', absen: 2 },
            { nama: 'Citra Dewi', nis: '003', kelas: '10A', absen: 3 },
            { nama: 'Dina Kusuma', nis: '004', kelas: '10A', absen: 4 },
            { nama: 'Eka Pratama', nis: '005', kelas: '10A', absen: 5 }
        ];

        siswaData.forEach(siswa => {
            penilaian.tambahSiswa(siswa);
        });

        // Add sample scores
        penilaian.getDaftarSiswa().forEach(siswa => {
            // Sample ulangan
            penilaian.tambahNilaiUlanganHarian({ idSiswa: siswa.id, tipe: '1', nilai: 80 });
            penilaian.tambahNilaiUlanganHarian({ idSiswa: siswa.id, tipe: '2', nilai: 85 });

            // Sample sumatif
            penilaian.tambahNilaiSumatif({ idSiswa: siswa.id, tipe: '1', nilai: 78 });
            penilaian.tambahNilaiSumatif({ idSiswa: siswa.id, tipe: '2', nilai: 82 });

            // Sample ujian
            penilaian.tambahNilaiUjianAkhir({ idSiswa: siswa.id, nilai: 88 });

            // Sample tugas praktik
            penilaian.tambahNilaiTugasPraktek({ idSiswa: siswa.id, tipe: '1', nilai: 85 });
            penilaian.tambahNilaiTugasPraktek({ idSiswa: siswa.id, tipe: '2', nilai: 80 });

            // Sample tugas LKS
            penilaian.tambahNilaiTugasLKS({ idSiswa: siswa.id, tipe: '1', nilai: 90 });

            // Sample tugas mandiri
            penilaian.tambahNilaiTugasMandiri({ idSiswa: siswa.id, tipe: '1', nilai: 85 });

            // Sample tugas kelompok
            penilaian.tambahNilaiTugasKelompok({ idSiswa: siswa.id, tipe: '1', nilai: 82 });
        });
    }
}