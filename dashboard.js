// dashboard.js

// Base URL untuk semua API
const BASE_URL = "https://msk-dashboard-production.up.railway.app/api";

// =================== Utility ===================
function formatSmartNumber(value) {
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000_000) {
    return (
      (value / 1_000_000_000_000).toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " T"
    );
  }
  if (abs >= 1_000_000_000) {
    return (
      (value / 1_000_000_000).toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " M"
    );
  }
  if (abs >= 1_000_000) {
    return (
      (value / 1_000_000).toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " Jt"
    );
  }
  if (abs >= 1_000) {
    return (
      (value / 1_000).toLocaleString("id-ID", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + " Rb"
    );
  }
  return value.toLocaleString("id-ID");
}

// =================== Total Unit Entry ===================
async function loadUnitEntry() {
  try {
    const res = await fetch(`${BASE_URL}/total-entry`);
    const data = await res.json();

    const total = data.total_entry;
    let displayValue = "";

    if (total >= 1000) {
      const ribuan = total / 1000;
      displayValue =
        ribuan.toLocaleString("id-ID", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }) + " Rb";
    } else {
      displayValue = total.toLocaleString("id-ID");
    }

    document.getElementById("unitEntryValue").innerText = displayValue;
  } catch (err) {
    console.error("Gagal load total entry:", err);
    document.getElementById("unitEntryValue").innerText = "-";
  }
}

// =================== Total Amount ===================
async function loadTotalAmount() {
  try {
    const res = await fetch(`${BASE_URL}/total-amount`);
    const data = await res.json();

    document.getElementById("totalAmountValue").innerText = formatSmartNumber(
      data.total_amount
    );
  } catch (err) {
    console.error("Gagal load total amount:", err);
    document.getElementById("totalAmountValue").innerText = "-";
  }
}

// =================== Gender Pie ===================
async function loadGenderPie() {
  try {
    const res = await fetch(`${BASE_URL}/gender`);
    const data = await res.json();

    new ApexCharts(document.querySelector("#genderPie"), {
      chart: {
        type: "pie",
        height: 260,
        toolbar: { show: true, tools: { download: true } },
      },
      labels: ["Laki-Laki", "Perempuan"],
      series: [data.persenlk, data.persenpr],
      legend: { position: "bottom" },
      tooltip: { y: { formatter: (val) => val.toLocaleString("id-ID") } },
      dataLabels: {
        formatter: (val, opts) =>
          opts.w.config.series[opts.seriesIndex].toLocaleString("id-ID"),
      },
    }).render();
  } catch (err) {
    console.error("Gagal load gender pie:", err);
  }
}

// =================== Motor Bar ===================
async function loadMotorBar() {
  try {
    const res = await fetch(`${BASE_URL}/type-motor`);
    const data = await res.json();

    const categories = data.map((item) => item.type);
    const seriesData = data.map((item) => item.total);

    new ApexCharts(document.querySelector("#motorBar"), {
      chart: {
        type: "bar",
        height: 260,
        toolbar: { show: true, tools: { download: true } },
      },
      plotOptions: { bar: { horizontal: true, barHeight: "70%" } },
      dataLabels: { enabled: false },
      series: [{ name: "Unit", data: seriesData }],
      xaxis: { categories },
      tooltip: { y: { formatter: (val) => val.toLocaleString("id-ID") } },
    }).render();
  } catch (err) {
    console.error("Gagal load type motor:", err);
  }
}

// =================== Job Bar ===================
async function loadJobBar() {
  try {
    const res = await fetch(`${BASE_URL}/pekerjaan`);
    const data = await res.json();

    const categories = data.map((item) => item.pekerjaan);
    const seriesData = data.map((item) => item.total);

    new ApexCharts(document.querySelector("#jobBar"), {
      chart: {
        type: "bar",
        height: 260,
        toolbar: { show: true, tools: { download: true } },
      },
      plotOptions: { bar: { horizontal: true, barHeight: "55%" } },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toLocaleString("id-ID"),
      },
      series: [{ name: "Jumlah", data: seriesData }],
      xaxis: { categories },
      tooltip: { y: { formatter: (val) => val.toLocaleString("id-ID") } },
    }).render();
  } catch (err) {
    console.error("Gagal load pekerjaan:", err);
  }
}

// =================== Init ===================
function initDashboard() {
  loadUnitEntry();
  loadTotalAmount();
  loadGenderPie();
  loadMotorBar();
  loadJobBar();
}

// Jalankan saat load
document.addEventListener("DOMContentLoaded", initDashboard);
