import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePdf = (data, chartImageBase64) => {
  const doc = new jsPDF();
  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (date) => date.toLocaleDateString('pt-BR');
  const formatYearsMonths = (months) => {
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (y === 0) return `${m} meses`;
    if (m === 0) return `${y} ano${y > 1 ? 's' : ''}`;
    return `${y} ano${y > 1 ? 's' : ''} e ${m} ${m > 1 ? 'meses' : 'mês'}`;
  };

  // Colors
  const textColor = [51, 51, 51];
  const greenColor = [16, 185, 129];
  const tableHeaderColor = [41, 100, 240];

  // Header
  doc.setFontSize(18);
  doc.setTextColor(10, 10, 10);
  doc.text('Simulação de Amortização Imobiliária', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Cliente: ${data.clientName || 'Não informado'}`, 14, 28);
  doc.text(`Data: ${formatDate(new Date())}`, 14, 33);

  // Resumo do Financiamento
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  doc.setFont(undefined, 'bold');
  doc.text('Resumo do Financiamento', 14, 45);

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Valor Financiado: ${formatCurrency(data.pv)}`, 14, 52);
  doc.text(`Sistema: ${data.system}`, 14, 58);
  doc.text(`Taxa de Juros: ${data.rateAa}% a.a.`, 14, 64);
  doc.text(`Prazo Original: ${data.months} meses (${formatYearsMonths(data.months)})`, 14, 70);

  doc.text(`Total a Pagar (Original): ${formatCurrency(data.originalTotalPagar)}`, 110, 52);
  doc.text(`Juros do Contrato: ${formatCurrency(data.originalTotalJuros)}`, 110, 58);

  // Impacto das Amortizações Extras
  doc.setFontSize(12);
  doc.setTextColor(...greenColor);
  doc.setFont(undefined, 'bold');
  doc.text('Impacto das Amortizações Extras', 14, 85);

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.setFont(undefined, 'normal');
  doc.text(`Total Amortizado: ${formatCurrency(data.totalAmortizado)}`, 14, 92);
  doc.text(`Novo Prazo: ${data.prazoAtual} meses (${formatYearsMonths(data.prazoAtual)})`, 14, 98);
  doc.text(`Amortização Manual: ${formatCurrency(data.totalAmortizadoManual)}`, 14, 104);

  doc.text(`Economia de Juros: ${formatCurrency(data.economiaJuros)}`, 110, 92);
  doc.text(`Total Pago Efetivo: ${formatCurrency(data.amortizedTotalPagar)}`, 110, 98);
  doc.setTextColor(...greenColor);
  doc.text(`Amortização FGTS: ${formatCurrency(data.totalAmortizadoFgts)}`, 110, 104);

  // Chart
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Evolução do Saldo Devedor', 14, 120);
  
  if (chartImageBase64) {
    doc.addImage(chartImageBase64, 'PNG', 14, 125, 180, 140);
  }

  // Table on next page
  doc.addPage();
  
  const tableData = [];
  // Build table data
  // Table columns: Mês, Sd. Inicial, Amort., Juros, Parcela, Amort. Manual, Amort. FGTS, Sd. Corrigido, Parc. Corrigida
  for (let i = 0; i < data.amortizedTable.length; i++) {
    const orig = data.originalTable[i];
    const amor = data.amortizedTable[i];
    
    const isPaidOff = (amor.initialBalance === 0 && amor.pmt === 0);

    tableData.push([
      amor.month,
      formatCurrency(orig.initialBalance),
      formatCurrency(orig.amortization),
      formatCurrency(orig.juros),
      formatCurrency(orig.pmt),
      amor.extraManual > 0 ? formatCurrency(amor.extraManual) : '-',
      amor.extraFgts > 0 ? formatCurrency(amor.extraFgts) : '-',
      isPaidOff ? '' : formatCurrency(amor.finalBalance),
      isPaidOff ? '' : formatCurrency(amor.pmt),
      isPaidOff // Hidden flag
    ]);
  }

  autoTable(doc, {
    startY: 20,
    head: [['Mês', 'Sd. Inicial', 'Amort.', 'Juros', 'Parcela', 'Amort. Manual', 'Amort. FGTS', 'Sd. Corrigido', 'Parc. Corrigida']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: tableHeaderColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      halign: 'right'
    },
    columnStyles: {
      0: { halign: 'center' }
    },
    willDrawCell: (data) => {
      // data.row.raw[9] is the isPaidOff flag
      if (data.section === 'body') {
        if (data.row.raw[9]) {
          doc.setTextColor(200, 200, 200); // Faint text
        } else {
          if (data.column.index === 5 && data.row.raw[5] !== '-') {
            doc.setTextColor(234, 88, 12); // orange-600
            doc.setFont(undefined, 'bold');
          } else if (data.column.index === 6 && data.row.raw[6] !== '-') {
            doc.setTextColor(5, 150, 105); // emerald-600
            doc.setFont(undefined, 'bold');
          } else {
            doc.setTextColor(51, 51, 51);
            doc.setFont(undefined, 'normal');
          }
        }
      }
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.row.raw[9] && data.column.index < 5) {
        // Draw a strikethrough line for original columns
        const startX = data.cell.x;
        const endX = data.cell.x + data.cell.width;
        const y = data.cell.y + data.cell.height / 2;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(startX, y, endX, y);
      }
    }
  });

  doc.save('simulacao_amortizacao.pdf');
};
