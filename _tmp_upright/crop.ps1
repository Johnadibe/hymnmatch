param([string]$name, [int]$x, [int]$y, [int]$w, [int]$h, [string]$out, [double]$scale = 2.0)
Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\JOHN\Documents\Chapel Songs of Praise App\_tmp_upright"
$img = [System.Drawing.Bitmap]::FromFile((Join-Path $dir $name))
# coordinates given in displayed (576-wide) space -> scale to saved
$f = $img.Width / 576.0
$rect = [System.Drawing.Rectangle]::new([int]($x*$f), [int]($y*$f), [int]($w*$f), [int]($h*$f))
$crop = $img.Clone($rect, $img.PixelFormat)
$big = [System.Drawing.Bitmap]::new([int]($crop.Width*$scale), [int]($crop.Height*$scale))
$g = [System.Drawing.Graphics]::FromImage($big); $g.InterpolationMode='HighQualityBicubic'
$g.DrawImage($crop, 0, 0, $big.Width, $big.Height); $g.Dispose()
$big.Save((Join-Path $dir $out), [System.Drawing.Imaging.ImageFormat]::Png)
$big.Dispose(); $crop.Dispose(); $img.Dispose()
