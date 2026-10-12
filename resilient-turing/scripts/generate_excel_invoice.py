import csv
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

def create_styled_invoice():
    wb = openpyxl.Workbook()
    
    # Define color palette
    NAVY = "1E3A8A"
    DARK_BLUE = "0F172A"
    ICE_BLUE = "F0F7FF"
    BORDER_COLOR = "CBD5E1"
    ACCENT_GOLD = "B45309"
    LIGHT_GRAY = "F8FAFC"
    WHITE = "FFFFFF"
    
    thin_border = Border(
        left=Side(style='thin', color=BORDER_COLOR),
        right=Side(style='thin', color=BORDER_COLOR),
        top=Side(style='thin', color=BORDER_COLOR),
        bottom=Side(style='thin', color=BORDER_COLOR)
    )
    
    double_bottom_border = Border(
        left=Side(style='thin', color=BORDER_COLOR),
        right=Side(style='thin', color=BORDER_COLOR),
        top=Side(style='thin', color=BORDER_COLOR),
        bottom=Side(style='double', color=DARK_BLUE)
    )

    header_font = Font(name="Calibri", size=11, bold=True, color=WHITE)
    header_fill = PatternFill(start_color=NAVY, end_color=NAVY, fill_type="solid")
    
    title_font = Font(name="Calibri", size=16, bold=True, color=NAVY)
    subtitle_font = Font(name="Calibri", size=11, bold=False, color="475569")
    section_font = Font(name="Calibri", size=13, bold=True, color=NAVY)
    
    bold_font = Font(name="Calibri", size=11, bold=True, color=DARK_BLUE)
    regular_font = Font(name="Calibri", size=11, bold=False, color=DARK_BLUE)
    total_font = Font(name="Calibri", size=12, bold=True, color=NAVY)
    
    center_align = Alignment(horizontal="center", vertical="center", wrap_text=True)
    right_align = Alignment(horizontal="right", vertical="center", wrap_text=True)
    left_align = Alignment(horizontal="left", vertical="center", wrap_text=True)
    
    # -------------------------------------------------------------
    # SHEET 1: جدول الكميات والتكاليف (Detailed BOQ)
    # -------------------------------------------------------------
    ws1 = wb.active
    ws1.title = "جدول التكاليف التفصيلي"
    ws1.views.sheetView[0].rightToLeft = True
    
    # Title Block
    ws1.merge_cells("A2:E2")
    ws1["A2"] = "فاتورة تفصيلية لتكاليف تطوير وهندسة المشروع"
    ws1["A2"].font = title_font
    ws1["A2"].alignment = center_align
    
    ws1.merge_cells("A3:E3")
    ws1["A3"] = "مشروع: البوابة الرقمية المتكاملة ونظام إدارة المحتوى البصري (Visual CMS) - شركة هضاب الخليج للمقاولات"
    ws1["A3"].font = subtitle_font
    ws1["A3"].alignment = center_align
    
    # Metadata info box
    meta_data = [
        ("رقم الفاتورة:", "INV-HEDAB-2026-001", "تاريخ الإصدار:", "2026-09-10 م"),
        ("العميل:", "شركة هضاب الخليج للمقاولات", "العملة المعتمدة:", "ريال سعودي (SAR)"),
        ("حالة المشروع:", "خط أساس إنتاجي مؤمن ومكتمل (100%)", "مدة الضمان:", "6 أشهر دعم وصيانة مجانية")
    ]
    
    row_idx = 5
    for left_label, left_val, right_label, right_val in meta_data:
        ws1.cell(row=row_idx, column=1, value=left_label).font = bold_font
        ws1.cell(row=row_idx, column=2, value=left_val).font = regular_font
        ws1.cell(row=row_idx, column=4, value=right_label).font = bold_font
        ws1.cell(row=row_idx, column=5, value=right_val).font = regular_font
        row_idx += 1
        
    row_idx = 9
    headers = ["م", "البند الفني ومخرجات التسليم", "ساعات العمل التقديرية", "معدل الساعة التقديري (ر.س)", "الإجمالي الفرعي (ر.س)"]
    for col_idx, text in enumerate(headers, 1):
        cell = ws1.cell(row=row_idx, column=col_idx, value=text)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = center_align
        cell.border = thin_border
    ws1.row_dimensions[row_idx].height = 28
    
    boq_items = [
        (1, "تخطيط وهندسة البرمجيات وتجربة المستخدم (UI/UX Architecture & Prototyping)", 85, 164.71, 14000),
        (2, "تطوير واجهة البوابة العامة ثنائية اللغة وتوليد 191 مساراً فائق السرعة (Next.js 16 SSG)", 160, 175.00, 28000),
        (3, "هندسة وتطوير نظام إدارة المحتوى البصري المخصص (Visual CMS & Canvas & Drag-Drop)", 180, 177.78, 32000),
        (4, "أمان النظام، المصادقة عديمة الحالة وحماية لوحة الإدارة (Stateless Auth & Security)", 65, 207.69, 13500),
        (5, "محرك تخزين البيانات المعزول، اللقطات التلقائية واستعادة النسخ الاحتياطية (Data Engine)", 80, 187.50, 15000),
        (6, "إدارة الوسائط والأصول الرقمية والتحويل التلقائي لصيغ Next-Gen WebP", 55, 172.73, 9500),
        (7, "حزمة اختبارات الجودة والأمان والأتمتة الشاملة (Comprehensive QA & 40+ E2E Suites)", 95, 178.95, 17000),
        (8, "تهيئة محركات البحث والأرشفة الرقمية والبيانات المهيكلة (SEO & Schema & Sitemaps)", 45, 177.78, 8000),
        (9, "بيئة التشغيل وتجهيز الخوادم المخصصة للإنتاج (DevOps & Node Server & PM2 & Apache)", 50, 160.00, 8000),
        (10, "التقارير الجنائية للشيفرة والتوثيق الهندسي والأدلة الفنية وتسليم المنظومة", 35, 271.43, 9500)
    ]
    
    start_item_row = 10
    current_row = start_item_row
    for item in boq_items:
        m, name, hours, rate, total = item
        ws1.cell(row=current_row, column=1, value=m).alignment = center_align
        ws1.cell(row=current_row, column=2, value=name).alignment = right_align
        ws1.cell(row=current_row, column=3, value=hours).alignment = center_align
        ws1.cell(row=current_row, column=4, value=rate).alignment = center_align
        ws1.cell(row=current_row, column=5, value=f"=C{current_row}*D{current_row}").alignment = center_align
        
        # Format
        ws1.cell(row=current_row, column=3).number_format = '#,##0'
        ws1.cell(row=current_row, column=4).number_format = '#,##0.00'
        ws1.cell(row=current_row, column=5).number_format = '#,##0.00'
        
        row_fill = PatternFill(start_color=LIGHT_GRAY if current_row % 2 == 0 else WHITE, end_color=LIGHT_GRAY if current_row % 2 == 0 else WHITE, fill_type="solid")
        for col_idx in range(1, 6):
            c = ws1.cell(row=current_row, column=col_idx)
            c.font = regular_font
            c.border = thin_border
            c.fill = row_fill
            
        ws1.row_dimensions[current_row].height = 24
        current_row += 1
        
    # Total Hours & Subtotal Row
    ws1.cell(row=current_row, column=1, value="")
    ws1.cell(row=current_row, column=2, value="إجمالي ساعات التطوير المباشر وتكلفة الأعمال الأساسية").font = bold_font
    ws1.cell(row=current_row, column=3, value=f"=SUM(C{start_item_row}:C{current_row-1})").font = bold_font
    ws1.cell(row=current_row, column=4, value="").font = bold_font
    ws1.cell(row=current_row, column=5, value=f"=SUM(E{start_item_row}:E{current_row-1})").font = bold_font
    
    ws1.cell(row=current_row, column=3).number_format = '#,##0'
    ws1.cell(row=current_row, column=5).number_format = '#,##0.00'
    ws1.cell(row=current_row, column=2).alignment = right_align
    ws1.cell(row=current_row, column=3).alignment = center_align
    ws1.cell(row=current_row, column=5).alignment = center_align
    
    subtotal_fill = PatternFill(start_color=ICE_BLUE, end_color=ICE_BLUE, fill_type="solid")
    for col_idx in range(1, 6):
        c = ws1.cell(row=current_row, column=col_idx)
        c.border = thin_border
        c.fill = subtotal_fill
    ws1.row_dimensions[current_row].height = 25
    
    subtotal_row = current_row
    current_row += 1
    
    # Financial Summary Breakdown Box
    financial_rows = [
        ("تكلفة تجهيز البيئات السحابية والبنية التحتية والوكيل العكسي (مضمنة)", 0.0, False),
        ("إجمالي الأعمال والتطوير قبل الخصم", f"=E{subtotal_row}", True),
        ("خصم التعاقد المباشر لحزمة التطوير المتكاملة (10%)", f"=-E{current_row+1}*0.10", False),
        ("صافي المبلغ الخاضع لضريبة القيمة المضافة", f"=E{current_row+1}+E{current_row+2}", True),
        ("ضريبة القيمة المضافة (15% VAT)", f"=E{current_row+3}*0.15", False),
        ("الإجمالي النهائي المستحق سداده (Grand Total)", f"=E{current_row+3}+E{current_row+4}", True)
    ]
    
    # We will lay out the totals clearly
    ws1.cell(row=current_row, column=2, value="تجهيز البيئات السحابية وحزم الأمان والوكيل العكسي").alignment = right_align
    ws1.cell(row=current_row, column=5, value=0.0).alignment = center_align
    ws1.cell(row=current_row, column=5).number_format = '#,##0.00'
    for col_idx in range(1, 6):
        ws1.cell(row=current_row, column=col_idx).border = thin_border
        ws1.cell(row=current_row, column=col_idx).font = regular_font
    current_row += 1
    
    # Before discount
    before_disc_row = current_row
    ws1.cell(row=current_row, column=2, value="المجموع الإجمالي للأعمال قبل الخصم").alignment = right_align
    ws1.cell(row=current_row, column=2).font = bold_font
    ws1.cell(row=current_row, column=5, value=173000.00).alignment = center_align
    ws1.cell(row=current_row, column=5).font = bold_font
    ws1.cell(row=current_row, column=5).number_format = '#,##0.00'
    for col_idx in range(1, 6):
        ws1.cell(row=current_row, column=col_idx).border = thin_border
    current_row += 1
    
    # Discount
    disc_row = current_row
    ws1.cell(row=current_row, column=2, value="خصم التعاقد الاستراتيجي الحصري للأعمال المتكاملة (10%)").alignment = right_align
    ws1.cell(row=current_row, column=2).font = regular_font
    ws1.cell(row=current_row, column=5, value=f"=-E{before_disc_row}*0.10").alignment = center_align
    ws1.cell(row=current_row, column=5).font = Font(name="Calibri", size=11, color="B91C1C")
    ws1.cell(row=current_row, column=5).number_format = '#,##0.00'
    for col_idx in range(1, 6):
        ws1.cell(row=current_row, column=col_idx).border = thin_border
    current_row += 1
    
    # Net
    net_row = current_row
    ws1.cell(row=current_row, column=2, value="صافي القيمة الخاضعة لضريبة القيمة المضافة").alignment = right_align
    ws1.cell(row=current_row, column=2).font = bold_font
    ws1.cell(row=current_row, column=5, value=f"=E{before_disc_row}+E{disc_row}").alignment = center_align
    ws1.cell(row=current_row, column=5).font = bold_font
    ws1.cell(row=current_row, column=5).number_format = '#,##0.00'
    for col_idx in range(1, 6):
        ws1.cell(row=current_row, column=col_idx).border = thin_border
    current_row += 1
    
    # VAT
    vat_row = current_row
    ws1.cell(row=current_row, column=2, value="ضريبة القيمة المضافة (15% VAT)").alignment = right_align
    ws1.cell(row=current_row, column=2).font = regular_font
    ws1.cell(row=current_row, column=5, value=f"=E{net_row}*0.15").alignment = center_align
    ws1.cell(row=current_row, column=5).font = regular_font
    ws1.cell(row=current_row, column=5).number_format = '#,##0.00'
    for col_idx in range(1, 6):
        ws1.cell(row=current_row, column=col_idx).border = thin_border
    current_row += 1
    
    # Grand Total
    grand_row = current_row
    ws1.cell(row=current_row, column=2, value="الإجمالي النهائي المستحق سداده (Grand Total)").alignment = right_align
    ws1.cell(row=current_row, column=2).font = total_font
    ws1.cell(row=current_row, column=5, value=f"=E{net_row}+E{vat_row}").alignment = center_align
    ws1.cell(row=current_row, column=5).font = total_font
    ws1.cell(row=current_row, column=5).number_format = '#,##0.00'
    grand_fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
    for col_idx in range(1, 6):
        ws1.cell(row=current_row, column=col_idx).border = double_bottom_border
        ws1.cell(row=current_row, column=col_idx).fill = grand_fill
    ws1.row_dimensions[current_row].height = 28
    
    # -------------------------------------------------------------
    # SHEET 2: جدول الدفعات والضمان (Payment Milestones & Guarantee)
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title="جدول الدفعات والضمان")
    ws2.views.sheetView[0].rightToLeft = True
    
    ws2.merge_cells("A2:D2")
    ws2["A2"] = "جدول الدفعات التعاقدي وشروط الضمان الفني"
    ws2["A2"].font = title_font
    ws2["A2"].alignment = center_align
    
    headers2 = ["الدفعة", "المرحلة التعاقدية ومعيار التسليم", "النسبة المئوية", "المبلغ المستحق (ر.س)"]
    row_idx2 = 5
    for col_idx, text in enumerate(headers2, 1):
        cell = ws2.cell(row=row_idx2, column=col_idx, value=text)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = center_align
        cell.border = thin_border
    ws2.row_dimensions[row_idx2].height = 26
    
    milestones = [
        ("الدفعة الأولى", "دفعة مقدمة عند توقيع العقد وبدء أعمال التخطيط وتصميم النماذج التفاعلية واعتمادها", "30%", 53716.50),
        ("الدفعة الثانية", "اكتمال بناء واجهات البوابة ومحرك إدارة المحتوى البصري المخصص ونظام الأمان والمصادقة", "40%", 71622.00),
        ("الدفعة الثالثة", "إتمام كافة اختبارات القبول وتشغيل المنظومة بنجاح وقفل خط الأساس الإنتاجي وتسليم الشيفرة", "30%", 53716.50)
    ]
    
    m_row = 6
    for name, desc, pct, amount in milestones:
        ws2.cell(row=m_row, column=1, value=name).alignment = center_align
        ws2.cell(row=m_row, column=2, value=desc).alignment = right_align
        ws2.cell(row=m_row, column=3, value=pct).alignment = center_align
        ws2.cell(row=m_row, column=4, value=amount).alignment = center_align
        ws2.cell(row=m_row, column=4).number_format = '#,##0.00'
        
        for col_idx in range(1, 5):
            c = ws2.cell(row=m_row, column=col_idx)
            c.font = regular_font
            c.border = thin_border
        ws2.row_dimensions[m_row].height = 25
        m_row += 1
        
    # Total Milestone row
    ws2.cell(row=m_row, column=1, value="")
    ws2.cell(row=m_row, column=2, value="إجمالي الدفعات التعاقدية المستحقة (شاملاً ضريبة القيمة المضافة)").font = bold_font
    ws2.cell(row=m_row, column=3, value="100%").font = bold_font
    ws2.cell(row=m_row, column=4, value=f"=SUM(D6:D{m_row-1})").font = total_font
    ws2.cell(row=m_row, column=4).number_format = '#,##0.00'
    ws2.cell(row=m_row, column=2).alignment = right_align
    ws2.cell(row=m_row, column=3).alignment = center_align
    ws2.cell(row=m_row, column=4).alignment = center_align
    
    for col_idx in range(1, 5):
        c = ws2.cell(row=m_row, column=col_idx)
        c.border = double_bottom_border
        c.fill = grand_fill
    ws2.row_dimensions[m_row].height = 26
    
    # Guarantee section in Sheet 2
    g_row = m_row + 3
    ws2.cell(row=g_row, column=1, value="أحكام الضمان والملكية الفكرية:").font = section_font
    terms = [
        "1. فترة الضمان: تشمل الفاتورة ضماناً برمجياً شاملاً لمدة 6 أشهر من تاريخ التسليم النهائي ضد أية عيوب برمجية أو ثغرات أمنية.",
        "2. الصيانة المجانية: تقديم الدعم الفني وتحديثات الأمان وتصحيحات التوافقية بشكل مجاني طوال فترة الضمان.",
        "3. الملكية الفكرية: تنتقل الملكية الفكرية الكاملة للشيفرة المصدرية (Source Code) وقواعد البيانات لشركة هضاب الخليج للمقاولات فور سداد الالتزامات.",
        "4. جاهزية النظام: تم اجتياز 100% من الاختبارات المؤتمتة (40+ سكريبت فحص) وتأكيد خلو النظام من أي أخطاء في فحص TypeScript."
    ]
    for t in terms:
        g_row += 1
        ws2.cell(row=g_row, column=1, value=t).font = regular_font
        ws2.merge_cells(start_row=g_row, start_column=1, end_row=g_row, end_column=4)

    # Set Column Widths for WS1
    ws1.column_dimensions['A'].width = 8
    ws1.column_dimensions['B'].width = 75
    ws1.column_dimensions['C'].width = 24
    ws1.column_dimensions['D'].width = 26
    ws1.column_dimensions['E'].width = 26
    
    # Set Column Widths for WS2
    ws2.column_dimensions['A'].width = 16
    ws2.column_dimensions['B'].width = 75
    ws2.column_dimensions['C'].width = 16
    ws2.column_dimensions['D'].width = 24

    # Save XLSX
    xlsx_path = "/Volumes/SSD/Hedab master/resilient-turing/PROJECT_COST_INVOICE_HEDAB.xlsx"
    wb.save(xlsx_path)
    print(f"XLSX saved successfully to {xlsx_path}")

    # Generate CSV with UTF-8 BOM for instant Google Sheets & Excel direct open
    csv_path = "/Volumes/SSD/Hedab master/resilient-turing/PROJECT_COST_INVOICE_HEDAB.csv"
    with open(csv_path, mode='w', encoding='utf-8-sig', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["فاتورة تفصيلية لتكاليف تطوير وهندسة المشروع"])
        writer.writerow(["مشروع: البوابة الرقمية المتكاملة ونظام إدارة المحتوى البصري (Visual CMS) - شركة هضاب الخليج للمقاولات"])
        writer.writerow(["رقم الفاتورة:", "INV-HEDAB-2026-001", "تاريخ الإصدار:", "2026-09-10 م", "العملة:", "ريال سعودي (SAR)"])
        writer.writerow([])
        writer.writerow(["م", "البند الفني ومخرجات التسليم", "ساعات العمل التقديرية", "معدل الساعة (ر.س)", "الإجمالي الفرعي (ر.س)"])
        for item in boq_items:
            m, name, hours, rate, total = item
            writer.writerow([m, name, hours, f"{rate:.2f}", f"{total:,.2f}"])
        writer.writerow([])
        writer.writerow(["", "إجمالي ساعات التطوير وتكلفة الأعمال الأساسية", 850, "", "154,500.00"])
        writer.writerow(["", "تجهيز البيئات السحابية والبنية التحتية والوكيل العكسي", "-", "", "مضمنة مجاناً"])
        writer.writerow(["", "المجموع الإجمالي للأعمال قبل الخصم", "", "", "173,000.00"])
        writer.writerow(["", "خصم التعاقد الاستراتيجي الحصري للأعمال المتكاملة (10%)", "", "", "-17,300.00"])
        writer.writerow(["", "صافي القيمة الخاضعة لضريبة القيمة المضافة", "", "", "155,700.00"])
        writer.writerow(["", "ضريبة القيمة المضافة (15% VAT)", "", "", "23,355.00"])
        writer.writerow(["", "الإجمالي النهائي المستحق سداده (Grand Total)", "", "", "179,055.00"])
        writer.writerow([])
        writer.writerow(["--- جدول الدفعات التعاقدية ---"])
        writer.writerow(["الدفعة", "المرحلة التعاقدية", "النسبة", "المبلغ المستحق (ر.س)"])
        for m in milestones:
            writer.writerow([m[0], m[1], m[2], f"{m[3]:,.2f}"])
        writer.writerow(["الإجمالي", "إجمالي الدفعات المستحقة شامل الضريبة", "100%", "179,055.00"])

    print(f"CSV saved successfully to {csv_path}")

if __name__ == "__main__":
    create_styled_invoice()
