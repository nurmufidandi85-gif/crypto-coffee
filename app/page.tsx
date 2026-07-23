"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers"; 
import abiDariRemix from "./abi.json"; 

export default function Home() {
  // GANTI teks di bawah ini dengan alamat kontrak dari Remix kemarin (0x...)
  const [alamatKontrak, setAlamatKontrak] = useState("0x7b96aF9Bd211cBf6BA5b0dd53aa61Dc5806b6AcE");
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [daftarMemo, setDaftarMemo] = useState<any[]>([]);
  const [statusDompet, setStatusDompet] = useState("Belum Terhubung");

  async function klikBeliKopi() {
    try {
      if (!window.ethereum) return alert("Silakan instal dompet MetaMask terlebih dahulu!");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const kontrakKopi = new ethers.Contract(alamatKontrak, abiDariRemix, signer);
      
      const transaksi = await kontrakKopi.beliKopi(nama, pesan, {
        value: ethers.parseEther("0.001") 
      });
      
      alert("Transaksi dikirim! Menunggu konfirmasi blockchain...");
      await transaksi.wait(); 
      alert("Terima kasih! Donasi kopi berhasil masuk dompet Anda!");
      
      setNama("");
      setPesan("");
      muatDaftarMemo(); 
    } catch (eror) {
      console.error(eror);
      alert("Transaksi dibatalkan atau terjadi gangguan jaringan!");
    }
  }

  async function muatDaftarMemo() {
      async function muatDaftarMemo() {
    try {
      if (!window.ethereum) return;
      
      // 🔓 MEMAKSA KONEKSI AKSES: Meminta izin dompet aktif sejak awal
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" }); 
      
      const kontrakKopi = new ethers.Contract(alamatKontrak, abiDariRemix, provider);
      
      const hasilMemo = await kontrakKopi.ambilSemuaMemo();
      setDaftarMemo(hasilMemo);
      setStatusDompet("MetaMask Terhubung"); // Mengubah status menjadi hijau terhubung
    } catch (eror) {
      console.error(eror);
      setStatusDompet("Belum Terhubung");
    }
  }

  }

  useEffect(() => {
    muatDaftarMemo();
  }, [alamatKontrak]);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", color: "#333", backgroundColor: "#fff", minHeight: "100vh" }}>
      <h1 style={{ color: "#8B4513", marginTop: "0" }}>☕ Crypto Coffee</h1>
      <p style={{ color: "#555" }}>Status Koneksi: <b style={{ color: statusDompet === "MetaMask Terhubung" ? "green" : "red" }}>{statusDompet}</b></p>
      
      <div style={{ marginBottom: "20px", background: "#f0f0f0", padding: "15px", borderRadius: "5px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}><b>Alamat Smart Contract (Sepolia):</b></label>
        <input 
          type="text" 
          value={alamatKontrak} 
          onChange={(e) => setAlamatKontrak(e.target.value)} 
          style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#FFF8DC", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
        <h3 style={{ margin: "0 0 5px 0", color: "#5c2d16" }}>Kirim Kopi Hangat Untuk Pemilik</h3>
        <input type="text" placeholder="Masukkan Nama Anda" value={nama} onChange={(e) => setNama(e.target.value)} style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <textarea placeholder="Tulis Pesan Hangat Anda..." value={pesan} onChange={(e) => setPesan(e.target.value)} style={{ padding: "12px", height: "80px", borderRadius: "5px", border: "1px solid #ccc", resize: "none" }} />
        <button onClick={klikBeliKopi} style={{ background: "#8B4513", color: "white", padding: "14px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
          Kirim Donasi Kopi (0.001 ETH)
        </button>
      </div>

      <h3 style={{ marginTop: "40px", color: "#5c2d16" }}>📜 Catatan Memo Donatur Terbaik:</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {daftarMemo.length === 0 ? <p style={{ color: "gray" }}>Belum ada donatur, jadilah yang pertama!</p> : 
          daftarMemo.map((memo: any, indeks: number) => (
            <div key={indeks} style={{ borderLeft: "5px solid #8B4513", padding: "12px", background: "#f9f9f9", borderRadius: "0 5px 5px 0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              <p style={{ margin: "0 0 6px 0" }}><b>{memo.nama}</b> mendonasikan kopi:</p>
              <i style={{ color: "#555", display: "block" }}>"{memo.pesan}"</i>
            </div>
          ))
        }
      </div>
    </div>
  );
}
