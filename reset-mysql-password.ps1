# MySQL Root 密码重置脚本（需以管理员身份运行）
# 右键此文件 -> "使用 PowerShell 运行"，或管理员终端中执行此脚本

$ErrorActionPreference = "Stop"

$mysqlService = "MySQL80"
$mysqld = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
$myIni = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
$initFile = "$env:USERPROFILE\mysql-init.txt"
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"

Write-Host "===== MySQL 密码重置脚本 =====" -ForegroundColor Cyan
Write-Host ""

# Step 1: 创建 init-file
Write-Host "[1/4] 创建密码重置 SQL 文件..." -ForegroundColor Yellow
"ALTER USER 'root'@'localhost' IDENTIFIED BY '';" | Out-File -FilePath $initFile -Encoding ASCII
Write-Host "      已创建: $initFile"

# Step 2: 停止 MySQL 服务
Write-Host "[2/4] 停止 MySQL 服务..." -ForegroundColor Yellow
Stop-Service -Name $mysqlService -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "      MySQL80 已停止"

# Step 3: 以 init-file 模式启动 MySQL，执行密码重置
Write-Host "[3/4] 以 init-file 模式启动 MySQL..." -ForegroundColor Yellow
$proc = Start-Process -FilePath $mysqld -ArgumentList "--defaults-file=`"$myIni`" --init-file=`"$initFile`" --console" -NoNewWindow -PassThru
Start-Sleep -Seconds 5

# Step 4: 停止临时进程，恢复正常服务
Write-Host "[4/4] 恢复正常服务..." -ForegroundColor Yellow
Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Start-Service -Name $mysqlService
Write-Host "      MySQL80 服务已恢复运行"

# 清理 init-file
Remove-Item -Path $initFile -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "===== 密码重置完成! =====" -ForegroundColor Green
Write-Host "root 密码已设为空（无密码）"
Write-Host ""

# 验证连接
Write-Host "验证连接..." -ForegroundColor Cyan
$mysqlBin = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
try {
    $result = & $mysqlBin -u root -e "SELECT 'Connection OK!' AS status;" 2>&1
    Write-Host $result -ForegroundColor Green
} catch {
    Write-Host "请手动测试: `"$mysqlBin`" -u root" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
