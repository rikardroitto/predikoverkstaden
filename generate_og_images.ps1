Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot "og"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

function New-RoundedRectPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function Save-OgImage {
    param(
        [string]$FilePath,
        [string]$Title,
        [string]$BigScoreText,
        [string]$SuffixText,
        [string]$Line1,
        [string]$Line2,
        [string]$BadgeText
    )

    $bmp = New-Object System.Drawing.Bitmap(1200, 630)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Colors matching nt2026-eller-nt1981
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 246, 243, 236))
    $cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 224, 217, 203), 2)
    $navyBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 31, 58, 95))
    $darkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 29, 35, 42))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 89, 99, 110))
    $urlBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 132, 146, 158))

    # Fill background
    $g.FillRectangle($bgBrush, 0, 0, 1200, 630)

    # Main white card
    $cardPath = New-RoundedRectPath 38 38 1124 554 26
    $g.FillPath($cardBrush, $cardPath)
    $g.DrawPath($borderPen, $cardPath)

    # Right-side decorative manuscript cards (inspired by nt2026-eller-nt1981)
    $state1 = $g.Save()
    $g.TranslateTransform(890, 325)
    $g.RotateTransform(-5.5)
    $backCardPath = New-RoundedRectPath -115 -155 230 310 18
    $backCardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 252, 250, 246))
    $backCardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 222, 214, 200), 2)
    $g.FillPath($backCardBrush, $backCardPath)
    $g.DrawPath($backCardPen, $backCardPath)
    $lineBrushBack = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 228, 222, 210))
    for ($i = 0; $i -lt 7; $i++) {
        $lw = if ($i -eq 6) { 110 } else { 170 }
        $lp = New-RoundedRectPath -85 (-115 + $i * 28) $lw 11 5
        $g.FillPath($lineBrushBack, $lp)
        $lp.Dispose()
    }
    $g.Restore($state1)

    $state2 = $g.Save()
    $g.TranslateTransform(985, 290)
    $g.RotateTransform(4.5)
    $shadowPath = New-RoundedRectPath -118 -154 244 328 18
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 29, 35, 42))
    $g.FillPath($shadowBrush, $shadowPath)

    $frontCardPath = New-RoundedRectPath -122 -162 244 328 18
    $frontCardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 27, 116, 70), 2.5)
    $g.FillPath($cardBrush, $frontCardPath)
    $g.DrawPath($frontCardPen, $frontCardPath)

    $lineBrushFront = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 224, 219, 208))
    $widths = @(185, 165, 180, 150, 175, 125)
    for ($i = 0; $i -lt $widths.Length; $i++) {
        $lp = New-RoundedRectPath -92 (-124 + $i * 28) $widths[$i] 11 5
        $g.FillPath($lineBrushFront, $lp)
        $lp.Dispose()
    }

    # Badge on front card
    $badgePath = New-RoundedRectPath -92 85 136 42 18
    $badgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 229, 243, 234))
    $badgeFg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 20, 83, 45))
    $badgeFont = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.FillPath($badgeBg, $badgePath)
    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString($BadgeText, $badgeFont, $badgeFg, [System.Drawing.RectangleF]::new(-92, 85, 136, 42), $sfCenter)
    $g.Restore($state2)

    # Typography on the left
    $titleFont = New-Object System.Drawing.Font("Georgia", 42, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString($Title, $titleFont, $navyBrush, 86, 86)

    if ($BigScoreText -ne "") {
        $scoreFont = New-Object System.Drawing.Font("Georgia", 168, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $suffixFont = New-Object System.Drawing.Font("Georgia", 46, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

        $g.DrawString($BigScoreText, $scoreFont, $navyBrush, 76, 170)
        $scoreSize = $g.MeasureString($BigScoreText, $scoreFont)
        $suffixX = 76 + $scoreSize.Width - 18
        $g.DrawString($SuffixText, $suffixFont, $mutedBrush, $suffixX, 282)
    } else {
        $heroFont = New-Object System.Drawing.Font("Georgia", 68, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $g.DrawString($SuffixText, $heroFont, $darkBrush, 86, 215)
    }

    $descFont = New-Object System.Drawing.Font("Segoe UI", 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString($Line1, $descFont, $darkBrush, 88, 442)
    $g.DrawString($Line2, $descFont, $darkBrush, 88, 482)

    $urlFont = New-Object System.Drawing.Font("Segoe UI", 21, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString("rikardroitto.github.io/predikoverkstaden", $urlFont, $urlBrush, 88, 536)

    $bmp.Save($FilePath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
}

$ae = [char]0x00E4 # ä
$oe = [char]0x00F6 # ö
$aa = [char]0x00E5 # å

# Start image
Save-OgImage -FilePath (Join-Path $outDir "start.png") `
    -Title "Predikoverkstaden" `
    -BigScoreText "" `
    -SuffixText "Fr${aa}n text till predikstol" `
    -Line1 "Ett homiletiskt strategispel om pastorns vardag," `
    -Line2 "textens mognad och s${oe}ndagens predikan." `
    -BadgeText "HOMILETIK"

for ($s = 0; $s -le 100; $s++) {
    Save-OgImage -FilePath (Join-Path $outDir "sv-$s.png") `
        -Title "Predikoverkstaden" `
        -BigScoreText "$s" `
        -SuffixText "av 100 po${ae}ng" `
        -Line1 "Hur v${ae}l f${oe}rbereder och levererar du s${oe}ndagens" `
        -Line2 "predikan? Kan du sl${aa} ${s} av 100 po${ae}ng?" `
        -BadgeText "PREDIKAN"

    Save-OgImage -FilePath (Join-Path $outDir "en-$s.png") `
        -Title "The Homiletics Workshop" `
        -BigScoreText "$s" `
        -SuffixText "out of 100" `
        -Line1 "How well can you prepare and preach Sunday's" `
        -Line2 "sermon? Can you beat ${s} out of 100 points?" `
        -BadgeText "SERMON"
}

Write-Output "Generated 203 OG PNG images in $outDir"
