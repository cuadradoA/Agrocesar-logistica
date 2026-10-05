/**
 * MFE LogÃ­stica y Carrito de Compras (AgroCesar)
 * TecnologÃ­a: Svelte (Standalone / Standalone Component vÃ­a CDN)
 * Responsable: Equipo LogÃ­stica (Anderson Cuadrado)
 */

(function () {
  const activeApps = new Map();
  const activeListeners = new Map();

  /**
   * Montaje del MFE LogÃ­stica y Carrito
   */
  window.mountAgroLogistica = function (containerId, props = {}) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) {
      console.error(`[AgroLogistica] Contenedor '${containerId}' no encontrado.`);
      return;
    }

    if (window.unmountAgroLogistica) {
      window.unmountAgroLogistica(containerId);
    }

    // Estado Reactivo / Svelte Component Simulation
    let items = [
      { id: 'PROD-101', nombre: 'Queso CosteÃ±o Artesanal (Kg)', precio: 22000, cantidad: 2 },
      { id: 'PROD-102', nombre: 'Yuca Criolla de Valledupar (Bulto)', precio: 35000, cantidad: 1 }
    ];
    let offlineMode = props.offlineMode || false;

    function render() {
      const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

      container.innerHTML = `
        <div class="agro-carrito-container">
          <div class="agro-carrito-header">
            <h3>🛒 Carrito y ConsolidaciÃ³n de Pedido</h3>
            ${offlineMode ? '<span class="agro-badge-offline">Modo Offline Resiliente</span>' : ''}
          </div>

          ${
            items.length === 0
              ? '<p style="text-align:center; padding: 20px; color: #6b7280;">El carrito estÃ¡ vacÃ­o. Agrega productos desde el CatÃ¡logo.</p>'
              : `
              <div class="agro-items-list">
                ${items
                  .map(
                    (item) => `
                  <div class="agro-item-row" data-id="${item.id}">
                    <div class="agro-item-info">
                      <span class="agro-item-nombre">${item.nombre}</span>
                      <span class="agro-item-precio">$${item.precio.toLocaleString()} c/u</span>
                    </div>
                    <div class="agro-cant-controls">
                      <button class="agro-btn-circle btn-restar" data-id="${item.id}">-</button>
                      <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.cantidad}</span>
                      <button class="agro-btn-circle btn-sumar" data-id="${item.id}">+</button>
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>

              <div class="agro-resumen-panel">
                <div class="agro-resumen-total">
                  <span>Total Pedido:</span>
                  <span>$${total.toLocaleString()}</span>
                </div>
                <button id="btn-consolidar-pedido" class="agro-btn-comprar">
                  🚀 Consolidar y Enviar Pedido (Emitir Evento)
                </button>
              </div>
            `
          }
        </div>
      `;

      // Registrar listeners para controles reactivos de la UI de Svelte
      container.querySelectorAll('.btn-sumar').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const item = items.find((i) => i.id === id);
          if (item) item.cantidad++;
          render();
        });
      });

      container.querySelectorAll('.btn-restar').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const item = items.find((i) => i.id === id);
          if (item && item.cantidad > 1) {
            item.cantidad--;
          } else {
            items = items.filter((i) => i.id !== id);
          }
          render();
        });
      });

      const btnConsolidar = container.querySelector('#btn-consolidar-pedido');
      if (btnConsolidar) {
        btnConsolidar.addEventListener('click', () => {
          if (items.length === 0) return;

          const pedidoId = 'PED-' + Math.floor(Math.random() * 8999 + 1000);
          const totalFinal = total;

          // Evento v2 que el MFE de Pedidos (Vue 3) escucha
          const eventoPedidoV2 = new CustomEvent('pedido:confirmado:v2', {
            detail: {
              pedidoId: pedidoId,
              total: totalFinal,
              idConductor: 'COND-404 (Transportes Cesar)'
            },
            bubbles: true
          });

          window.dispatchEvent(eventoPedidoV2);
          console.log('[AgroLogistica] Emitido pedido:confirmado:v2 ->', eventoPedidoV2.detail);

          alert(`¡Pedido #${pedidoId} consolidado con éxito! Se ha notificado al MFE de Seguimiento de Pedidos.`);
          items = [];
          render();
        });
      }
    }

    // Escuchar evento de carrito:agregado desde el MFE Catálogo (Preact)
    const handleCarritoAgregado = (e) => {
      const detail = e.detail || {};
      console.log('[AgroLogistica] Evento carrito:agregado recibido:', detail);

      const id = detail.idProducto || detail.id || 'PROD-' + Math.floor(Math.random() * 500);
      const nombre = detail.nombre || 'Producto AgroCesar';
      const precio = detail.precio || 15000;
      const cantidad = detail.cantidad || 1;

      const existente = items.find((i) => i.id === id);
      if (existente) {
        existente.cantidad += cantidad;
      } else {
        items.push({ id, nombre, precio, cantidad });
      }
      render();
    };

    window.addEventListener('carrito:agregado', handleCarritoAgregado);
    activeListeners.set(containerId, handleCarritoAgregado);

    render();
    activeApps.set(containerId, true);
    console.log(`[AgroLogistica] Montado con éxito en #${containerId}`);
  };

  /**
   * Desmontaje de MFE Logística
   */
  window.unmountAgroLogistica = function (containerId) {
    const targetId = typeof containerId === 'string' ? containerId : containerId.id;

    if (activeListeners.has(targetId)) {
      window.removeEventListener('carrito:agregado', activeListeners.get(targetId));
      activeListeners.delete(targetId);
    }

    activeApps.delete(targetId);
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (container) {
      container.innerHTML = '';
    }
    console.log(`[AgroLogistica] Desmontado de '${targetId}'.`);
  };
})();
