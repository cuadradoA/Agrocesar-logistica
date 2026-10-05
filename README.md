# AgroCesar Logística (MFE Carrito y Logística)

Micro Frontend de Carrito de Compras, Consolidación de Pedidos y Rutas Logísticas para **AgroCesar Marketplace**, desarrollado para el **Equipo Logística**.

## 🛠️ Tecnologías e Integración
- **Tecnología:** Svelte (Standalone / Zero-build via CDN).
- **Enfoque:** Integración en tiempo de ejecución (JS Import Maps / Global Scope via window).
- **Contratos:**
  - Montaje: `window.mountAgroLogistica(containerId, props)`
  - Desmontaje: `window.unmountAgroLogistica(containerId)`

## 📡 Bus de Eventos (CustomEvents)
- **Escucha:** `carrito:agregado` (Recibe items añadidos desde el MFE Catálogo en Preact).
- **Emite:** `pedido:confirmado:v2` (Emite pedido consolidado hacia el MFE Seguimiento de Pedidos en Vue 3).
