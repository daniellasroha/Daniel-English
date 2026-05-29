"use client";

import { Component } from "react";

// Error Boundary — menangkap crash di mana saja dalam app
// dan menampilkan pesan ramah alih-alih layar putih kosong
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[App Error]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 p-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
              Oops, ada masalah!
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Aplikasi mengalami error tak terduga. Data belajarmu aman —
              coba muat ulang halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow"
            >
              🔄 Muat Ulang Halaman
            </button>
            <details className="mt-5 text-left">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                Detail error (untuk developer)
              </summary>
              <pre className="text-xs text-red-500 mt-2 overflow-auto bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
