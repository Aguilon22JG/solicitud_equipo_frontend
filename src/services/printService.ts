import QRCode from 'qrcode';
import { Order, PrintableOrder } from '@/types';
import { PRINT_CONFIG } from '@/constants';

class PrintService {
  // Generate QR Code
  async generateQRCode(data: string): Promise<string> {
    try {
      const qrCodeUrl = await QRCode.toDataURL(data, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      return qrCodeUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  // Generate printable order
  async generatePrintableOrder(order: Order): Promise<PrintableOrder> {
    const qrData = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      url: `${window.location.origin}/ordenes/${order.id}`,
    };

    const qrCode = await this.generateQRCode(JSON.stringify(qrData));

    return {
      orderData: order,
      qrCode,
      institutionLogo: '/logo.png', // Institution logo path
      printDate: new Date(),
      format: 'A4',
    };
  }

  // Print order document
  printOrder(printableOrder: PrintableOrder): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = this.generateOrderHTML(printableOrder);
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Auto print after a short delay
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  // Generate HTML for order printing
  private generateOrderHTML(printableOrder: PrintableOrder): string {
    const { orderData, qrCode, printDate } = printableOrder;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Orden ${orderData.orderNumber}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 12px; 
              line-height: 1.4;
              padding: ${PRINT_CONFIG.MARGINS.TOP}mm;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px; 
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            .header h1 { 
              font-size: 18px; 
              margin-bottom: 5px; 
              color: #333;
            }
            .header h2 { 
              font-size: 14px; 
              color: #666; 
              margin-bottom: 10px;
            }
            .order-info { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
              margin-bottom: 20px; 
            }
            .info-section { 
              border: 1px solid #ddd; 
              padding: 15px; 
              border-radius: 5px;
            }
            .info-section h3 { 
              font-size: 14px; 
              margin-bottom: 10px; 
              color: #333;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .info-row { 
              display: flex; 
              margin-bottom: 5px; 
            }
            .info-label { 
              font-weight: bold; 
              width: 120px; 
              color: #555;
            }
            .equipment-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            .equipment-table th, 
            .equipment-table td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            .equipment-table th { 
              background-color: #f5f5f5; 
              font-weight: bold; 
            }
            .qr-section { 
              text-align: center; 
              margin: 20px 0; 
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .qr-code { 
              margin: 10px 0; 
            }
            .signatures { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 40px; 
              margin-top: 40px; 
              page-break-inside: avoid;
            }
            .signature-box { 
              text-align: center; 
              padding-top: 30px; 
              border-top: 1px solid #333; 
            }
            .footer { 
              margin-top: 30px; 
              text-align: center; 
              font-size: 10px; 
              color: #666; 
              border-top: 1px solid #eee;
              padding-top: 10px;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-pendiente { background-color: #fff3cd; color: #856404; }
            .status-aprobada { background-color: #d1ecf1; color: #0c5460; }
            .status-en-uso { background-color: #d4edda; color: #155724; }
            @media print {
              body { margin: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>UNIVERSIDAD - GESTIÓN DE EQUIPOS</h1>
            <h2>Solicitud de Préstamo de Equipos</h2>
            <div class="status-badge status-${orderData.status.toLowerCase()}">
              ${this.getStatusLabel(orderData.status)}
            </div>
          </div>

          <div class="order-info">
            <div class="info-section">
              <h3>Información de la Orden</h3>
              <div class="info-row">
                <span class="info-label">No. Orden:</span>
                <span>${orderData.orderNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Fecha Solicitud:</span>
                <span>${new Date(orderData.requestDate).toLocaleDateString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Fecha Programada:</span>
                <span>${new Date(orderData.scheduledDate).toLocaleDateString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Horario:</span>
                <span>${orderData.startTime} - ${orderData.endTime}</span>
              </div>
            </div>

            <div class="info-section">
              <h3>Información del Catedrático</h3>
              <div class="info-row">
                <span class="info-label">Nombre:</span>
                <span>${orderData.professor.username}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span>${orderData.professor.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Curso:</span>
                <span>${orderData.course.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Aula:</span>
                <span>${orderData.classroom.name}</span>
              </div>
            </div>
          </div>

          <table class="equipment-table">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Descripción</th>
                <th>Cantidad Solicitada</th>
                <th>Cantidad Entregada</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.equipmentRequests.map((req: any) => `
                <tr>
                  <td>${req.equipment.name}</td>
                  <td>${req.equipment.description}</td>
                  <td>${req.requestedQuantity}</td>
                  <td>${req.deliveredQuantity || '___'}</td>
                  <td>_______________</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          ${orderData.observations ? `
            <div class="info-section">
              <h3>Observaciones</h3>
              <p>${orderData.observations}</p>
            </div>
          ` : ''}

          <div class="qr-section">
            <h3>Código QR</h3>
            <div class="qr-code">
              <img src="${qrCode}" alt="QR Code" style="width: 120px; height: 120px;" />
            </div>
            <p>Escanee este código para ver los detalles de la orden</p>
          </div>

          <div class="signatures">
            <div class="signature-box">
              <p><strong>Firma del Catedrático</strong></p>
              <p>Nombre: ${orderData.professor.username}</p>
              <p>Fecha: _______________</p>
            </div>
            <div class="signature-box">
              <p><strong>Firma del Recepcionista</strong></p>
              <p>Nombre: _______________</p>
              <p>Fecha: _______________</p>
            </div>
          </div>

          <div class="footer">
            <p>Documento generado el ${printDate.toLocaleString()}</p>
            <p>Sistema de Gestión de Equipos - Universidad</p>
          </div>
        </body>
      </html>
    `;
  }

  private getStatusLabel(status: string): string {
    const statusLabels: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      APROBADA: 'Aprobada',
      EN_USO: 'En Uso',
      COMPLETADA: 'Completada',
      RECHAZADA: 'Rechazada',
    };
    return statusLabels[status] || status;
  }

  // Generate delivery receipt
  printDeliveryReceipt(order: Order): void {
    // Similar implementation for delivery receipt
    console.log('Printing delivery receipt for order:', order.id);
  }

  // Generate return receipt
  printReturnReceipt(order: Order): void {
    // Similar implementation for return receipt
    console.log('Printing return receipt for order:', order.id);
  }
}

export const printService = new PrintService();