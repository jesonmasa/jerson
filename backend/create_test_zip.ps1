$dir = 'test_zip_content'
New-Item -ItemType Directory -Force -Path $dir
Set-Content -Path "$dir\test.txt" -Value "Hello World"
Compress-Archive -Path "$dir\*" -DestinationPath 'test_payload.zip' -Force
Remove-Item -Recurse -Force $dir
Write-Host "ZIP Created"
