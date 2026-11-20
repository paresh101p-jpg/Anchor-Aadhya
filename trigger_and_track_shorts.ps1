$inputStr = "protocol=https`nhost=github.com`n"
$out = $inputStr | git credential fill
$token = ""
foreach ($line in $out) {
    if ($line.StartsWith("password=")) {
        $token = $line.Substring(9).Trim()
    }
}

if (-not $token) {
    Write-Host "ERROR: No GitHub token found via git credential fill!"
    exit 1
}

$headers = @{
    "Authorization" = "token $token"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "PowerShell-Tracker"
}

Write-Host ">>> Triggering daily_shorts.yml workflow dispatch on branch master..."
$body = '{"ref":"master"}'
try {
    $resp = Invoke-RestMethod -Uri "https://api.github.com/repos/paresh101p-jpg/Anchor-Aadhya/actions/workflows/daily_shorts.yml/dispatches" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host ">>> Dispatched successfully!"
} catch {
    Write-Host ">>> Dispatch error: $_"
    exit 1
}

Write-Host ">>> Waiting 10 seconds for GitHub Actions to initialize the run..."
Start-Sleep -Seconds 10

# Find the run
$runId = $null
$runUrl = $null
for ($i = 0; $i -lt 5; $i++) {
    $runsData = Invoke-RestMethod -Uri "https://api.github.com/repos/paresh101p-jpg/Anchor-Aadhya/actions/runs?per_page=5" -Headers $headers
    foreach ($r in $runsData.workflow_runs) {
        if ($r.name -like "*Shorts*" -and ($r.status -eq "queued" -or $r.status -eq "in_progress")) {
            $runId = $r.id
            $runUrl = $r.html_url
            break
        }
    }
    if ($runId) { break }
    Start-Sleep -Seconds 4
}

if (-not $runId) {
    # If not found in queued/in_progress, get the most recent run
    $latest = $runsData.workflow_runs[0]
    $runId = $latest.id
    $runUrl = $latest.html_url
}

Write-Host ">>> Tracking Run ID: $runId"
Write-Host ">>> Run URL: $runUrl"

# Polling loop
$startTime = Get-Date
while ($true) {
    Start-Sleep -Seconds 15
    try {
        $run = Invoke-RestMethod -Uri "https://api.github.com/repos/paresh101p-jpg/Anchor-Aadhya/actions/runs/$runId" -Headers $headers
        $elapsed = [int]((Get-Date) - $startTime).TotalSeconds
        Write-Host "[$elapsed s] Status: $($run.status) | Conclusion: $($run.conclusion)"

        # Check job steps if available
        try {
            $jobsData = Invoke-RestMethod -Uri "https://api.github.com/repos/paresh101p-jpg/Anchor-Aadhya/actions/runs/$runId/jobs" -Headers $headers
            if ($jobsData.jobs -and $jobsData.jobs.Count -gt 0) {
                $job = $jobsData.jobs[0]
                foreach ($step in $job.steps) {
                    if ($step.status -eq "in_progress") {
                        Write-Host "      --> In Progress Step: $($step.name)"
                    }
                }
            }
        } catch { }

        if ($run.status -eq "completed") {
            Write-Host "=========================================="
            Write-Host "Run Finished! Conclusion: $($run.conclusion)"
            Write-Host "=========================================="
            break
        }
    } catch {
        Write-Host "API polling warning: $_"
    }
}
