import requests
import time

run_id = 42463301514
url = f"https://api.github.com/repos/paresh101p-jpg/Anchor-Aadhya/actions/runs/{run_id}/jobs"

for attempt in range(40):
    try:
        r = requests.get(url, headers={"User-Agent": "Actions-Monitor"})
        if r.status_code == 200:
            jobs = r.json().get("jobs", [])
            for j in jobs:
                curr_step = None
                for s in j.get("steps", []):
                    if s["status"] != "completed":
                        curr_step = f"{s['name']} [{s['status']}]"
                        break
                print(f"[{time.strftime('%H:%M:%S')}] Job: {j['name']} ({j['status']} / {j['conclusion']}) | Step: {curr_step}", flush=True)
                if j['status'] == 'completed':
                    print(f"\nFINAL CONCLUSION: {j['conclusion']}", flush=True)
                    exit(0)
    except Exception as e:
        print("Error:", e, flush=True)
    time.sleep(12)
