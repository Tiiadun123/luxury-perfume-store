# File tự động khởi động Claude Code qua 9Router
$env:ANTHROPIC_BASE_URL="http://localhost:20128/v1"
$env:ANTHROPIC_API_KEY="sk_9router"

Write-Host "---" -ForegroundColor Cyan
Write-Host "Đang khởi động Claude Code" -ForegroundColor Green
Write-Host "---" -ForegroundColor Cyan

claude --model vibe-sonnet
