$port = 8080
$basePath = $PSScriptRoot
if (-not $basePath) { $basePath = "C:\Users\USER\.gemini\antigravity\scratch\india-lake-ai-monitor" }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "============================================================"
    Write-Host "🌊 All India Lake Monitoring System (AILMS) Server Started"
    Write-Host "🌐 URL: http://localhost:$port/"
    Write-Host "📁 Root: $basePath"
    Write-Host "============================================================"
} catch {
    Write-Host "Port $port may be busy, trying 8088..."
    $port = 8088
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    $listener.Start()
    Write-Host "🌐 URL: http://localhost:$port/"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath) -or $localPath -eq "") {
            $localPath = "index.html"
        }
        $filePath = Join-Path $basePath $localPath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            if ($filePath.EndsWith(".html")) { $response.ContentType = "text/html; charset=utf-8" }
            elseif ($filePath.EndsWith(".js") -or $filePath.EndsWith(".ts") -or $filePath.EndsWith(".tsx")) { $response.ContentType = "application/javascript; charset=utf-8" }
            elseif ($filePath.EndsWith(".css")) { $response.ContentType = "text/css; charset=utf-8" }
            elseif ($filePath.EndsWith(".json")) { $response.ContentType = "application/json; charset=utf-8" }
            else { $response.ContentType = "application/octet-stream" }

            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found: $localPath")
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    } catch {
        # ignore client disconnects
    }
}
