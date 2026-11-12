"""Prepare the public store screenshots and the bilingual demo documents."""

from pathlib import Path
from shutil import copyfile
import subprocess
import sys
from xml.sax.saxutils import escape

from PIL import Image
from reportlab.graphics.barcode.qrencoder import QRCode, QRErrorCorrectLevel
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen.canvas import Canvas

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
PLAY = "https://play.google.com/store/apps/details?id=com.instrucalpro.app"
NAVY = HexColor("#081a30")
TEAL = HexColor("#075c58")
WASH = HexColor("#edf7f7")
SHOTS = ["converters", "signature", "complete-form", "history-search",
         "history-export", "complete-readings", "quick-form", "quick-readings"]


def text(pdf, x, y, content, size=11, bold=False, color=NAVY):
    pdf.setFillColor(color)
    pdf.setFont("Helvetica-Bold" if bold else "Helvetica", size)
    pdf.drawString(x, y, content)


def block(pdf, x, y, width, height, color):
    pdf.setFillColor(color)
    pdf.rect(x, y, width, height, fill=1, stroke=0)


calibration = [("0", "0.00", "0.00", "0.00"), ("25", "2.50", "2.49", "-0.01"),
               ("50", "5.00", "5.01", "+0.01"), ("75", "7.50", "7.52", "+0.02"),
               ("100", "10.00", "10.01", "+0.01")]
reports = {
    "quick": (
        ("Certificat d'étalonnage rapide", "Quick calibration certificate"),
        ("Transmetteur de pression PT-101 | 0-10 bar | 4-20 mA",
         "Pressure transmitter PT-101 | 0-10 bar | 4-20 mA"),
        ("Référence fictive PR-01", "Fictional reference PR-01"),
        (("Point (%)", "Référence (bar)", "Mesure (bar)", "Écart (bar)"),
         ("Point (%)", "Reference (bar)", "Reading (bar)", "Error (bar)")),
        calibration, ("Écart absolu maximal : 0,02 bar.", "Maximum absolute error: 0.02 bar."),
    ),
    "complete": (
        ("Certificat d'étalonnage complet", "Full calibration certificate"),
        ("Transmetteur de pression PT-101 | 0-10 bar | 4-20 mA",
         "Pressure transmitter PT-101 | 0-10 bar | 4-20 mA"),
        ("Étalon fictif PR-01 | Conditions : 22 °C, 48 % HR",
         "Fictional standard PR-01 | Conditions: 22 °C, 48% RH"),
        (("Point (%)", "Référence (bar)", "Montée (bar)", "Descente (bar)"),
         ("Point (%)", "Reference (bar)", "Increasing (bar)", "Decreasing (bar)")),
        [("0", "0.00", "0.00", "0.00"), ("25", "2.50", "2.49", "2.50"),
         ("50", "5.00", "5.01", "5.02"), ("75", "7.50", "7.52", "7.51"),
         ("100", "10.00", "10.01", "10.01")],
        ("Incertitude élargie illustrative : 0,04 bar (k = 2).",
         "Illustrative expanded uncertainty: 0.04 bar (k = 2)."),
    ),
    "valve": (
        ("Rapport de contrôle de vanne", "Valve test report"),
        ("Vanne de régulation FV-202 | Positionneur 4-20 mA",
         "Control valve FV-202 | 4-20 mA positioner"),
        ("Contrôle de course sur banc fictif", "Travel test on a fictional bench"),
        (("Commande (mA)", "Consigne (%)", "Montée (%)", "Descente (%)"),
         ("Command (mA)", "Target (%)", "Increasing (%)", "Decreasing (%)")),
        [("4.0", "0", "0.2", "0.3"), ("8.0", "25", "24.8", "25.1"),
         ("12.0", "50", "49.7", "50.1"), ("16.0", "75", "74.8", "75.2"),
         ("20.0", "100", "99.9", "99.9")],
        ("Écart maximal illustratif : 0,3 point de pourcentage.",
         "Illustrative maximum error: 0.3 percentage points."),
    ),
    "safety": (
        ("Rapport de contrôle de soupape", "Safety valve test report"),
        ("Soupape de sûreté PSV-303 | Pression de tarage : 8 bar",
         "Safety valve PSV-303 | Target set pressure: 8 bar"),
        ("Trois essais simulés sur un banc fictif", "Three simulated tests on a fictional bench"),
        (("Essai", "Cible (bar)", "Ouverture (bar)", "Refermeture (bar)"),
         ("Test", "Target (bar)", "Opening (bar)", "Reseating (bar)")),
        [("1", "8.00", "8.04", "7.62"), ("2", "8.00", "8.02", "7.60"),
         ("3", "8.00", "8.03", "7.61")],
        ("Pression d'ouverture moyenne illustrative : 8,03 bar.",
         "Illustrative mean opening pressure: 8.03 bar."),
    ),
}


def report(folder, key, report_data, lang):
    fr = lang == "fr"
    loc = 0 if fr else 1
    title, instrument, reference, headers, rows, note = report_data
    stem = folder / f"{key}-{lang}"
    pdf = Canvas(str(stem.with_suffix(".pdf")), pagesize=A4, invariant=1)
    pdf.setTitle(title[loc])
    width, height = A4
    block(pdf, 0, height - 195, width, 195, NAVY)
    text(pdf, 44, 785, "InstruCal Pro", 17, True, white)
    text(pdf, 44, 750, "DOCUMENT DE DÉMONSTRATION" if fr else "DEMONSTRATION DOCUMENT",
         10, True, HexColor("#8df2df"))
    text(pdf, 44, 714, title[loc], 24, True, white)
    text(pdf, 44, 680, instrument[loc], 11, False, white)
    text(pdf, 44, 610, "Informations d'intervention" if fr else "Test information", 16, True, TEAL)
    text(pdf, 44, 579, reference[loc])
    text(pdf, 44, 552, "Client fictif : Atelier Démo" if fr else "Fictional client: Demo Workshop")
    text(pdf, 44, 500, "Relevé des mesures" if fr else "Recorded measurements", 16, True, TEAL)
    for i, row in enumerate([headers[loc], *rows]):
        y = 458 - 31 * i
        block(pdf, 44, y - 9, width - 88, 31, TEAL if i == 0 else WASH if i % 2 else white)
        for x, value in zip((56, 182, 310, 440), row):
            value = value.replace(".", ",") if fr and i else value
            text(pdf, x, y, value, 10, i == 0, white if i == 0 else NAVY)
    text(pdf, 44, 247, "Résultat illustratif" if fr else "Illustrative result", 16, True, TEAL)
    text(pdf, 44, 217, note[loc])
    block(pdf, 44, 98, width - 88, 74, WASH)
    text(pdf, 57, 145, "Données fictives, exemple éditorial." if fr else "Fictional data, illustrative example.",
         11, True)
    text(pdf, 57, 122, "Aucune mesure réelle ni attestation de conformité." if fr else
         "No actual measurements or declaration of conformity.")
    text(pdf, 44, 45, "InstruCal Pro  |  " + key.upper() + "  |  1 / 1", 9)
    pdf.save()
    subprocess.run(["pdftoppm", "-r", "58", "-singlefile", "-png", str(stem.with_suffix(".pdf")),
                    str(stem)], check=True)
    png = stem.with_suffix(".png")
    with Image.open(png) as image:
        image.save(stem.with_suffix(".webp"), quality=83, method=6)
    png.unlink()


def qr():
    code = QRCode(None, QRErrorCorrectLevel.M)
    code.addData(PLAY)
    code.make()
    matrix = code.modules
    size = len(matrix) + 8
    path = " ".join(f"M{x + 4} {y + 4}h1v1h-1z"
                    for y, row in enumerate(matrix) for x, dark in enumerate(row) if dark)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
           f'shape-rendering="crispEdges"><title>{escape(PLAY)}</title>'
           f'<rect width="{size}" height="{size}" fill="#fff"/><path d="{path}"/></svg>')
    (ASSETS / "play-qr.svg").write_text(svg, encoding="utf-8")


if __name__ == "__main__":
    source = Path(sys.argv[1])
    screenshots = ASSETS / "screenshots"
    screenshots.mkdir(parents=True, exist_ok=True)
    for i, name in enumerate(SHOTS, 1):
        with Image.open(source / f"{i}.img") as original:
            image = original.convert("RGB")
            image.thumbnail((700, 1400), Image.Resampling.LANCZOS)
            image.save(screenshots / f"{name}.webp", quality=88, method=6)
    for lang in ("fr", "en"):
        copyfile(source / f"{lang}.png", ASSETS / f"play-{lang}.png")
    examples = ASSETS / "sample-certificates"
    examples.mkdir(exist_ok=True)
    for key, data in reports.items():
        for lang in ("fr", "en"):
            report(examples, key, data, lang)
    qr()
