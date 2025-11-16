import axios from "axios";

/**
 * Cliente HTTP para la API de AviationStack
 * 
 * ⚠️ IMPORTANTE:
 * - Plan Gratuito: Usa HTTP (sin SSL)
 * - Plan de Pago: Usa HTTPS (con SSL)
 */

export const apiClient = axios.create({
  // 🔓 HTTP para plan gratuito
  baseURL: "http://api.aviationstack.com/v1",
  
  // 🔒 HTTPS para plan de pago (comentado)
  // baseURL: "https://api.aviationstack.com/v1",
  
  timeout: 10000,
  
  headers: {
    'Accept': 'application/json',
  },
});