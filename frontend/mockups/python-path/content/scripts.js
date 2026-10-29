import { basicsTeaching } from './basicsTeaching.js'
import { lesson, check } from './lesson.js'

const entries = [
  {
    id: 'script-inventory', unit: 'S01', title: 'Summarize a service inventory.',
    prompt: 'Write summarize(services, region=None), counting each status. If a region is given, include only that region. Treat a missing status as "unknown". Return the dictionary.',
    solution: 'def summarize(services,region=None):\n    counts={}\n    for service in services:\n        if region is not None and service.get("region")!=region:\n            continue\n        status=service.get("status","unknown")\n        counts[status]=counts.get(status,0)+1\n    return counts',
    tests: [check('All services and missing status', 'rows=[{"region":"west","status":"ok"},{"region":"east","status":"error"},{"region":"west"}]\nassert summarize(rows)=={"ok":1,"error":1,"unknown":1}'), check('Region filter', 'assert summarize(rows,"west")=={"ok":1,"unknown":1}'), check('Empty inventory','assert summarize([])=={}')],
  },
  {
    id: 'script-logs', unit: 'S02', title: 'Read and summarize a log.',
    prompt: 'Read app.log. Each valid line starts with INFO, WARN or ERROR followed by a space and a message. Store severity counts in counts and the number of nonempty malformed lines in rejected. Ignore blank lines.',
    files: {'main.py':'# Read app.log\n','app.log':'INFO started\nERROR database unavailable\nWARN retrying\nnot-a-record\nINFO recovered\n\n'},
    solution: 'counts={}\nrejected=0\nwith open("app.log",encoding="utf-8") as source:\n    for line in source:\n        line=line.strip()\n        if not line: continue\n        level,sep,message=line.partition(" ")\n        if not sep or level not in {"INFO","WARN","ERROR"} or not message:\n            rejected+=1\n            continue\n        counts[level]=counts.get(level,0)+1',
    tests:[check('Severity counts','assert counts=={"INFO":2,"ERROR":1,"WARN":1}'), check('Rejected records','assert rejected==1')],
  },
  {
    id:'script-config',unit:'S03',title:'Validate configuration without hiding errors.',
    prompt:'Write validate(config), returning a list of invalid field names. region must be a nonempty string; retries must be an integer from 0 to 5 (not bool); enabled must be a bool. Missing fields are invalid. Return names sorted.',
    solution:'def validate(config):\n    errors=[]\n    if type(config.get("region")) is not str or not config["region"].strip(): errors.append("region")\n    if type(config.get("retries")) is not int or not 0<=config["retries"]<=5: errors.append("retries")\n    if type(config.get("enabled")) is not bool: errors.append("enabled")\n    return sorted(errors)',
    tests:[check('False and zero are valid','assert validate({"region":"west","retries":0,"enabled":False})==[]'),check('Missing values','assert validate({})==["enabled","region","retries"]'),check('Wrong types and bounds','assert validate({"region":"","retries":True,"enabled":"yes"})==["enabled","region","retries"]')],
  },
  {
    id:'script-csv',unit:'S04',title:'Create a report from CSV.',
    prompt:'Read resources.csv with csv.DictReader. Sum integer costs by region in totals, skipping rows with invalid numeric costs. Store the skipped count in rejected. Write totals as a JSON object to report.json.',
    files:{'main.py':'# Read resources.csv and write report.json\n','resources.csv':'region,cost\nwest,4\neast,3\nwest,2\neast,invalid\n'},
    solution:'import csv\nimport json\ntotals={}\nrejected=0\nwith open("resources.csv",newline="",encoding="utf-8") as source:\n    for row in csv.DictReader(source):\n        try:\n            cost=int(row["cost"])\n        except ValueError:\n            rejected+=1\n            continue\n        region=row["region"]\n        totals[region]=totals.get(region,0)+cost\nwith open("report.json","w",encoding="utf-8") as output:\n    json.dump(totals,output)',
    tests:[check('Grouped costs','assert totals=={"west":6,"east":3} and rejected==1'),check('JSON output','import json\nfrom pathlib import Path\nassert json.loads(Path("report.json").read_text())==totals')],
  },
  {
    id:'script-modules',unit:'S05',title:'Assemble a small reusable program.',
    prompt:'Create helpers.py with summarize(path), loading a JSON list of integers and returning its sum. In main.py, use argparse for required --input and optional --dry-run. Print the total; only write total.txt when --dry-run is absent. The runner supplies --input values.json --dry-run.',
    files:{'main.py':'# Parse arguments and call your helper\n','values.json':'[2, 4, 6]'}, argv:['--input','values.json','--dry-run'],
    solutionFiles:{'values.json':'[2, 4, 6]','helpers.py':'import json\ndef summarize(path):\n    with open(path,encoding="utf-8") as source:\n        return sum(json.load(source))\n','main.py':'import argparse\nfrom helpers import summarize\nparser=argparse.ArgumentParser()\nparser.add_argument("--input",required=True)\nparser.add_argument("--dry-run",action="store_true")\nargs=parser.parse_args()\ntotal=summarize(args.input)\nprint(total)\nif not args.dry_run:\n    with open("total.txt","w",encoding="utf-8") as output:\n        output.write(str(total))'},
    tests:[check('Printed total','assert _stdout.strip()=="12"'),check('Dry run does not write','from pathlib import Path\nassert not Path("total.txt").exists()'),check('Reusable helper','import helpers\nassert helpers.summarize("values.json")==12'),check('Ordinary run writes output','import contextlib,io,runpy,sys\n_saved=sys.argv[:]\nsys.argv=["main.py","--input","values.json"]\nwith contextlib.redirect_stdout(io.StringIO()):\n    runpy.run_path("main.py",run_name="__main__")\nsys.argv=_saved\nassert Path("total.txt").read_text()=="12"')],
  },
  {
    id:'script-api',unit:'S06',title:'Handle a paginated API response.',
    prompt:'Write collect_pages(client). Call client.fetch(token), starting with None. Each response contains items and next. Gather all items until next is None. If a call raises TimeoutError, retry that same token once; let a second timeout propagate. Use only the supplied fake client; no network calls.',
    solution:'def collect_pages(client):\n    token=None\n    items=[]\n    while True:\n        try:\n            page=client.fetch(token)\n        except TimeoutError:\n            page=client.fetch(token)\n        items.extend(page["items"])\n        token=page["next"]\n        if token is None:\n            return items',
    setup:'class FakeClient:\n    def __init__(self,failures=0):\n        self.failures=failures\n        self.calls=[]\n    def fetch(self,token):\n        self.calls.append(token)\n        if self.failures:\n            self.failures-=1\n            raise TimeoutError("simulated")\n        return {"items":[1,2],"next":"p2"} if token is None else {"items":[3],"next":None}\n',
    tests:[check('Collect all pages','c=FakeClient()\nassert collect_pages(c)==[1,2,3] and c.calls==[None,"p2"]'),check('Retry only the failed token','c=FakeClient(1)\nassert collect_pages(c)==[1,2,3] and c.calls==[None,None,"p2"]'),check('Do not retry forever','try:\n    collect_pages(FakeClient(2))\nexcept TimeoutError:\n    pass\nelse:\n    raise AssertionError("Propagate the second timeout")')],
  },
]

export default entries.map(entry => lesson({
  ...entry, track:'scripts',
  title: basicsTeaching[entry.id].title,
  note: basicsTeaching[entry.id].explanation, pitfall: basicsTeaching[entry.id].mistake,
  hints:['Identify input, transformation and output before writing the loop.','Keep parsing, validation and processing separate. Use the supplied file names and contract exactly.'],
}))
