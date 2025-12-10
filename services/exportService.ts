import { AnalysisData } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- CSV EXPORT ---
export const exportToCSV = (data: AnalysisData) => {
  const rows = [];
  
  // Headers
  rows.push(['Section', 'Category', 'Detail', 'Value/Context']);

  // Summary
  rows.push(['Executive Summary', 'Verdict', data.summary.verdict, '']);
  rows.push(['Executive Summary', 'Pricing Reality', `Starts at ${data.pricing.entry}. ${data.pricing.cons.join(". ")}`, '']);
  rows.push(['Executive Summary', 'Market Position', data.momentum.market_position, '']);
  rows.push(['Executive Summary', 'Platform Overview', data.platform_coverage.summary, '']);
  
  data.summary.painPoints.forEach((p, i) => rows.push(['Executive Summary', 'Pain Point', `${i+1}. ${p}`, '']));
  // Add feature gaps to pain points in CSV
  data.featureComparison.filter(f => f.reality && f.reality.length > 5).forEach(f => {
      rows.push(['Executive Summary', 'Pain Point (Feature Gap)', `${f.category}: ${f.reality}`, '']);
  });

  data.summary.advantages.forEach((a, i) => rows.push(['Executive Summary', 'Advantage', `${i+1}. ${a}`, '']));

  // Features
  data.featureComparison.forEach(f => {
    rows.push(['Feature Check', f.category, 'Competitor Promise', f.hootsuite]);
    rows.push(['Feature Check', f.category, 'Reality', f.reality]);
    rows.push(['Feature Check', f.category, 'Swat.io Advantage', f.swatio_advantage]);
  });

  // Momentum
  rows.push(['Momentum', 'Recent Updates', data.momentum.recent_updates, '']);

  // Red Flags
  data.red_flags.warnings.forEach(w => rows.push(['Red Flags', 'Warning', w, '']));
  data.red_flags.win_signals.forEach(w => rows.push(['Red Flags', 'Win Signal', w, '']));

  // Pricing
  rows.push(['Pricing', 'Entry Price', data.pricing.entry, '']);
  data.pricing.cons.forEach(c => rows.push(['Pricing', 'Con', c, '']));

  // Reviews
  rows.push(['Reviews', 'Consensus', data.reviewAnalysis.competitor_consensus, '']);
  rows.push(['Reviews', 'Swat.io Comparison', data.reviewAnalysis.swatio_comparison, '']);
  data.criticalReviews.forEach(r => {
    rows.push(['Critical Review', r.title, `Rating: ${r.rating}/3`, `${r.source} (${r.date}): ${r.comment}`]);
  });

  // Kill Shots
  data.killShots.forEach((k, i) => {
    rows.push([`Kill Shot #${i+1}`, k.title, k.statement, `Track: ${k.talkTrack}`]);
  });

  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Analysis_Swatio_vs_${data.name}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- DOCS (HTML) EXPORT ---
export const exportToDocs = (data: AnalysisData) => {
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Swat.io vs ${data.name}</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.5; color: #333; }
      h1 { color: #0C3146; font-size: 24px; border-bottom: 2px solid #2B9CDA; padding-bottom: 10px; }
      h2 { color: #0C3146; font-size: 18px; margin-top: 25px; background-color: #EEF9FF; padding: 5px 10px; }
      h3 { color: #18638B; font-size: 14px; margin-top: 15px; text-transform: uppercase; }
      p, li { font-size: 12px; }
      table { border-collapse: collapse; width: 100%; margin-top: 10px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
      th { background-color: #f2f2f2; font-weight: bold; }
      .box { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 4px; }
      .killshot { background-color: #FFF5F5; border-left: 5px solid #E71D36; padding: 10px; margin-bottom: 10px; }
    </style>
    </head>
    <body>
      <h1>Competitive Analysis: Swat.io vs ${data.name}</h1>
      <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h2>1. Executive Summary</h2>
      <div class="box">
        <h3>Verdict</h3>
        <p>${data.summary.verdict}</p>
        <p><strong>Pricing Reality:</strong> Starts at ${data.pricing.entry}. ${data.pricing.cons.slice(0, 2).join(". ")}.</p>
        
        <p style="margin-top: 10px;"><strong>Market Position:</strong> ${data.momentum.market_position}</p>
        <p><strong>Platform Focus:</strong> ${data.platform_coverage.summary}</p>
        
        <h3>Weaknesses (${data.name})</h3>
        <ul>
          ${data.summary.painPoints.map(p => `<li>${p}</li>`).join('')}
          ${data.featureComparison.filter(f => f.reality && f.reality.length > 5).slice(0, 3).map(f => `<li><strong>${f.category}:</strong> ${f.reality}</li>`).join('')}
        </ul>
        
        <h3>Swat.io Advantages</h3>
        <ul>${data.summary.advantages.map(a => `<li>${a}</li>`).join('')}</ul>
      </div>

      <h2>2. Feature Reality Check</h2>
      <table>
        <tr><th>Category</th><th>${data.name} Promise</th><th>Reality</th><th>Swat.io Advantage</th></tr>
        ${data.featureComparison.map(f => `
          <tr>
            <td><strong>${f.category}</strong></td>
            <td>${f.hootsuite}</td>
            <td>${f.reality}</td>
            <td style="background-color: #EEF9FF;"><strong>${f.swatio_advantage}</strong></td>
          </tr>
        `).join('')}
      </table>

      <h2>3. Pricing & Momentum</h2>
      <p><strong>Entry Price:</strong> ${data.pricing.entry}</p>
      <p><strong>Hidden Costs:</strong> ${data.pricing.cons.join(', ')}</p>
      <p><strong>Recent Updates:</strong> ${data.momentum.recent_updates}</p>

      <h2>4. Review Intelligence</h2>
      <p><strong>Market Consensus:</strong> ${data.reviewAnalysis.competitor_consensus}</p>
      <p><strong>Vs Swat.io:</strong> ${data.reviewAnalysis.swatio_comparison}</p>
      <h3>Critical Reviews</h3>
      <ul>
        ${data.criticalReviews.map(r => `<li><strong>${r.title}</strong> (${r.rating} stars): "${r.comment}" - <em>${r.source}, ${r.date}</em></li>`).join('')}
      </ul>

      <h2>5. Sales Kill Shots</h2>
      ${data.killShots.map((k, i) => `
        <div class="killshot">
          <p><strong>#${i+1}: ${k.title}</strong></p>
          <p style="font-size: 14px; font-style: italic;">"${k.statement}"</p>
          <p><strong>Talk Track:</strong> ${k.talkTrack}</p>
        </div>
      `).join('')}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Report_Swatio_vs_${data.name}.doc`; // .doc opens in Word/GDocs automatically
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- PDF EXPORT ---
export const exportToPDF = (data: AnalysisData) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  // Title
  doc.setFillColor(12, 49, 70); // Swat Dark Blue
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Swat.io vs ${data.name}`, margin, 20);
  
  y = 40;
  
  // Executive Summary
  doc.setTextColor(12, 49, 70);
  doc.setFontSize(14);
  doc.text('1. Executive Summary', margin, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  
  // Verdict
  const verdictText = doc.splitTextToSize(`Verdict: ${data.summary.verdict}`, 170);
  doc.text(verdictText, margin, y);
  y += verdictText.length * 5 + 3;

  // Pricing Reality
  doc.setFont('helvetica', 'bold');
  doc.text('Pricing Reality:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Starts at ${data.pricing.entry}. ${data.pricing.cons.slice(0, 2).join(". ")}.`, margin + 30, y);
  y += 10;

  // Market Position
  doc.setFont('helvetica', 'bold');
  doc.text('Market Position:', margin, y);
  const marketPosText = doc.splitTextToSize(data.momentum.market_position, 130);
  doc.setFont('helvetica', 'normal');
  doc.text(marketPosText, margin + 35, y);
  y += marketPosText.length * 5 + 3;

  // Platform Coverage
  doc.setFont('helvetica', 'bold');
  doc.text('Platform Focus:', margin, y);
  const platformText = doc.splitTextToSize(data.platform_coverage.summary, 130);
  doc.setFont('helvetica', 'normal');
  doc.text(platformText, margin + 35, y);
  y += platformText.length * 5 + 8;

  // Weaknesses
  doc.setFont('helvetica', 'bold');
  doc.text(`Weaknesses (${data.name}):`, margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  data.summary.painPoints.forEach(p => {
    doc.text(`• ${p}`, margin + 5, y);
    y += 5;
  });
  // Feature Gaps in Weaknesses
  data.featureComparison.filter(f => f.reality && f.reality.length > 5).slice(0, 3).forEach(f => {
    const text = doc.splitTextToSize(`• ${f.category}: ${f.reality}`, 160);
    doc.text(text, margin + 5, y);
    y += text.length * 5;
  });

  y += 5;

  // Advantages
  doc.setFont('helvetica', 'bold');
  doc.text('Swat.io Advantages:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  data.summary.advantages.forEach(a => {
    doc.text(`• ${a}`, margin + 5, y);
    y += 5;
  });
  y += 10;

  // Feature Table
  doc.setTextColor(12, 49, 70);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Feature Reality Check', margin, y);
  y += 5;

  const tableRows = data.featureComparison.map(f => [
    f.category,
    f.hootsuite,
    f.reality,
    f.swatio_advantage
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Category', `${data.name} Promise`, 'Reality Check', 'Swat.io Win']],
    body: tableRows,
    headStyles: { fillColor: [43, 156, 218] }, // Swat Blue
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 25 },
      3: { fontStyle: 'bold', textColor: [23, 170, 90] } // Green text for Swat advantage
    },
    margin: { top: 20, left: margin, right: margin }
  });

  // @ts-ignore
  y = doc.lastAutoTable.finalY + 15;

  // Kill Shots
  if (y > 250) { doc.addPage(); y = 20; }
  
  doc.setTextColor(12, 49, 70);
  doc.setFontSize(14);
  doc.text('3. Sales Kill Shots', margin, y);
  y += 10;

  data.killShots.forEach((k, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    
    doc.setFillColor(238, 249, 255);
    doc.rect(margin, y, 170, 25, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(12, 49, 70);
    doc.setFont('helvetica', 'bold');
    doc.text(`#${i+1}: ${k.title}`, margin + 5, y + 7);
    
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(60, 60, 60);
    doc.text(`"${k.statement}"`, margin + 5, y + 15);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Talk Track: ${k.talkTrack}`, margin + 5, y + 22);
    
    y += 30;
  });

  doc.save(`BattleCard_Swatio_vs_${data.name}.pdf`);
};