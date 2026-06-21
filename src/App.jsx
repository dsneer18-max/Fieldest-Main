import { useState, useRef } from "react";

const INIT_LIBRARY = {
  earthwork: [
    { id:"e1",  name:"Excavation - General",      unit:"CY",   material:0,    labor:12.5, equipment:8.0   },
    { id:"e2",  name:"Excavation - Rock",          unit:"CY",   material:0,    labor:22.0, equipment:28.0  },
    { id:"e3",  name:"Backfill - Compacted",       unit:"CY",   material:4.5,  labor:9.0,  equipment:5.5   },
    { id:"e4",  name:"Grading - Fine",             unit:"SY",   material:0,    labor:1.8,  equipment:1.2   },
    { id:"e5",  name:"Embankment Fill",            unit:"CY",   material:6.0,  labor:4.5,  equipment:3.5   },
    { id:"e6",  name:"Topsoil Strip and Stack",    unit:"CY",   material:0,    labor:5.5,  equipment:4.0   },
    { id:"e7",  name:"Haul and Dispose (on-site)", unit:"CY",   material:0,    labor:3.0,  equipment:6.0   },
    { id:"e8",  name:"Haul and Dispose (off-site)",unit:"CY",   material:22.0, labor:3.0,  equipment:8.0   },
    { id:"e9",  name:"Dewatering",                 unit:"DAY",  material:50.0, labor:120.0,equipment:200.0 },
  ],
  demolition: [
    { id:"d1",  name:"Concrete Demolition",       unit:"CY",   material:0,    labor:18.0, equipment:24.0  },
    { id:"d2",  name:"Asphalt Removal",           unit:"SY",   material:0,    labor:3.5,  equipment:4.5   },
    { id:"d3",  name:"Structure Demo - Wood",     unit:"SF",   material:0,    labor:4.0,  equipment:2.5   },
    { id:"d4",  name:"Structure Demo - Masonry",  unit:"SF",   material:0,    labor:7.5,  equipment:5.0   },
    { id:"d5",  name:"Saw Cutting - Concrete",    unit:"LF",   material:2.0,  labor:6.5,  equipment:3.0   },
    { id:"d6",  name:"Tree and Stump Removal",    unit:"EA",   material:0,    labor:450.0,equipment:350.0 },
    { id:"d7",  name:"Debris Hauling",            unit:"LOAD", material:180.0,labor:120.0,equipment:0     },
  ],
  utilities: [
    { id:"u1",  name:"Water Main 6in",            unit:"LF",   material:28.0, labor:22.0, equipment:12.0  },
    { id:"u2",  name:"Water Main 8in",            unit:"LF",   material:38.0, labor:25.0, equipment:14.0  },
    { id:"u3",  name:"Sewer Main 8in",            unit:"LF",   material:35.0, labor:28.0, equipment:15.0  },
    { id:"u4",  name:"Sewer Main 12in",           unit:"LF",   material:52.0, labor:34.0, equipment:18.0  },
    { id:"u5",  name:"Storm Drain 12in",          unit:"LF",   material:30.0, labor:22.0, equipment:12.0  },
    { id:"u6",  name:"Storm Drain 18in",          unit:"LF",   material:48.0, labor:28.0, equipment:15.0  },
    { id:"u7",  name:"Manhole 48in",              unit:"EA",   material:2200, labor:800.0,equipment:400.0 },
    { id:"u8",  name:"Fire Hydrant Assembly",     unit:"EA",   material:3200, labor:600.0,equipment:200.0 },
    { id:"u9",  name:"Trench Excavation",         unit:"LF",   material:0,    labor:8.0,  equipment:6.0   },
    { id:"u10", name:"Pipe Bedding Sand",         unit:"LF",   material:4.5,  labor:2.0,  equipment:0     },
  ],
};

const INIT_EQUIP = [
  { id:"eq1",  name:"Excavator 20-ton",            type:"Heavy Excavation", dayRate:1800, weekRate:7500,  mobilization:850  },
  { id:"eq2",  name:"Excavator 35-ton",            type:"Heavy Excavation", dayRate:2400, weekRate:9800,  mobilization:1200 },
  { id:"eq3",  name:"Bulldozer D6",                type:"Earthwork",        dayRate:1600, weekRate:6500,  mobilization:950  },
  { id:"eq4",  name:"Bulldozer D8",                type:"Earthwork",        dayRate:2200, weekRate:8800,  mobilization:1400 },
  { id:"eq5",  name:"Motor Grader 140M",           type:"Grading",          dayRate:1400, weekRate:5800,  mobilization:700  },
  { id:"eq6",  name:"Compactor Vibratory Roller",  type:"Compaction",       dayRate:700,  weekRate:2800,  mobilization:400  },
  { id:"eq7",  name:"Skid Steer",                  type:"General",          dayRate:550,  weekRate:2200,  mobilization:250  },
  { id:"eq8",  name:"Mini Excavator",              type:"General",          dayRate:650,  weekRate:2600,  mobilization:300  },
  { id:"eq9",  name:"Dump Truck 10CY",             type:"Hauling",          dayRate:650,  weekRate:2600,  mobilization:0    },
  { id:"eq10", name:"Dump Truck 14CY",             type:"Hauling",          dayRate:850,  weekRate:3400,  mobilization:0    },
  { id:"eq11", name:"Backhoe",                     type:"Utility Work",     dayRate:900,  weekRate:3700,  mobilization:500  },
  { id:"eq12", name:"Trencher Chain",              type:"Utility Work",     dayRate:650,  weekRate:2600,  mobilization:300  },
  { id:"eq13", name:"Plate Compactor",             type:"Compaction",       dayRate:180,  weekRate:650,   mobilization:0    },
  { id:"eq14", name:"Water Buffalo",               type:"Dust Control",     dayRate:250,  weekRate:900,   mobilization:0    },
  { id:"eq15", name:"Concrete Saw",                type:"Demolition",       dayRate:280,  weekRate:1100,  mobilization:0    },
];

const INIT_CREW = [
  { id:"cr1", name:"Superintendent",           hourlyRate:95, defaultHours:8 },
  { id:"cr2", name:"Foreman",                  hourlyRate:75, defaultHours:8 },
  { id:"cr3", name:"Heavy Equipment Operator", hourlyRate:68, defaultHours:8 },
  { id:"cr4", name:"Laborer General",          hourlyRate:42, defaultHours:8 },
  { id:"cr5", name:"Pipe Layer",               hourlyRate:55, defaultHours:8 },
  { id:"cr6", name:"Truck Driver CDL",         hourlyRate:52, defaultHours:8 },
  { id:"cr7", name:"Concrete Finisher",        hourlyRate:60, defaultHours:8 },
  { id:"cr8", name:"CMU Mason",                hourlyRate:65, defaultHours:8 },
];

const UNITS  = ["CY","SY","SF","LF","EA","DAY","LOAD","TON","LS","HR","WK"];
const TRADES = ["earthwork","demolition","utilities","general"];
const EQTYPES= ["Heavy Excavation","Earthwork","Grading","Compaction","General","Hauling","Utility Work","Demolition","Dust Control"];

let _id = 1;
const uid  = () => "i" + (_id++);
const n2   = (v) => parseFloat(v) || 0;
const fmt = (n) => isNaN(n) ? "$0.00" : Number(n).toLocaleString("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2});
const lnTot= (i) => (n2(i.material)+n2(i.labor)+n2(i.equipment)) * n2(i.qty);
const eqTot= (i) => (i.rentalType==="week" ? n2(i.weekRate)*n2(i.weeks) : n2(i.dayRate)*n2(i.days)) + n2(i.mobilization);
const crTot= (i) => n2(i.hourlyRate) * n2(i.hours) * n2(i.days) * n2(i.workers||1);
const tots = (p) => {
  const li = (p.lineItems||[]).reduce((s,i)=>s+lnTot(i),0);
  const eq = (p.equipmentItems||[]).reduce((s,i)=>s+eqTot(i),0);
  const cr = (p.crewItems||[]).reduce((s,i)=>s+crTot(i),0);
  const sub= li+eq+cr;
  const mu = sub*(n2(p.markup)/100);
  const tx = (sub+mu)*(n2(p.tax)/100);
  return {li,eq,cr,sub,mu,tx,total:sub+mu+tx};
};

const exportCSV = (proj) => {
  const {li,eq,cr,sub,mu,tx,total} = tots(proj);
  const rows = [
    ["FIELDEST BID"],["Project",proj.name,"Client",proj.client,"Date",proj.date],
    [],["TAKEOFF"],["Trade","Item","Unit","Qty","Material","Labor","Operating","Total"],
    ...(proj.lineItems||[]).map(i=>[i.trade,i.name,i.unit,i.qty,i.material,i.labor,i.equipment,lnTot(i).toFixed(2)]),
    [],["EQUIPMENT"],["Name","Type","Period","Duration","Day Rate","Week Rate","Mob","Total"],
    ...(proj.equipmentItems||[]).map(i=>[i.name,i.type,i.rentalType,i.rentalType==="day"?i.days:i.weeks,i.dayRate,i.weekRate,i.mobilization,eqTot(i).toFixed(2)]),
    [],["CREW"],["Role","Rate/hr","Workers","Hrs/Day","Days","Total"],
    ...(proj.crewItems||[]).map(i=>[i.name,i.hourlyRate,i.workers,i.hours,i.days,crTot(i).toFixed(2)]),
    [],["TOTALS"],["Takeoff",li.toFixed(2)],["Equipment",eq.toFixed(2)],["Crew",cr.toFixed(2)],
    ["Subtotal",sub.toFixed(2)],["Markup",mu.toFixed(2)],["Tax",tx.toFixed(2)],["TOTAL",total.toFixed(2)],
  ];
  const csv = rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(",")).join("\n");
  // Use data URI — works in sandboxed environments where Blob URLs are blocked
  const uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  const a = document.createElement("a");
  a.href = uri;
  a.download = (proj.name||"estimate")+".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const G = {
  bg:"#0e1117", sidebar:"#080b10", card:"#141924", border:"1px solid #1e2740",
  gold:"#c8a84b", text:"#e2e6f0", muted:"#4a5570", dim:"#3d4d6a",
};
const base = {
  card:    {background:G.card, border:G.border, borderRadius:8, padding:"18px 20px"},
  input:   {background:G.card, border:"1px solid #1e2740", borderRadius:6, color:G.text, padding:"7px 10px", fontSize:13, fontFamily:"'Barlow',sans-serif", width:"100%", outline:"none"},
  cinput:  {background:G.bg, border:"1px solid #1e2740", borderRadius:4, color:G.text, padding:"4px 7px", fontSize:12, fontFamily:"'DM Mono',monospace", width:72, outline:"none"},
  label:   {display:"block", fontSize:10, color:G.dim, letterSpacing:1.2, textTransform:"uppercase", marginBottom:5, fontWeight:600},
  primary: {background:G.gold, color:"#080b10", border:"none", borderRadius:6, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Barlow',sans-serif"},
  ghost:   {background:"transparent", color:"#6b7a99", border:"1px solid #1e2740", borderRadius:6, padding:"8px 14px", fontSize:13, cursor:"pointer", fontFamily:"'Barlow',sans-serif"},
  danger:  {background:"transparent", color:"#c05a3a", border:"1px solid #3a1e18", borderRadius:6, padding:"8px 14px", fontSize:13, cursor:"pointer", fontFamily:"'Barlow',sans-serif"},
  icon:    {background:"none", border:"none", color:G.dim, cursor:"pointer", fontSize:16, padding:"4px 6px"},
  th:      {padding:"7px 10px", textAlign:"left", color:G.dim, fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", borderBottom:"1px solid #1e2740"},
  td:      {padding:"7px 10px", fontSize:13, verticalAlign:"middle", borderBottom:"1px solid #0e1117"},
};
const navSty = (on) => ({display:"flex",alignItems:"center",gap:9,width:"100%",padding:"9px 12px",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontFamily:"'Barlow',sans-serif",fontWeight:500,textAlign:"left",marginBottom:2,background:on?"#1a2030":"transparent",color:on?G.text:G.muted});
const tabSty = (on) => ({background:"transparent",border:"none",borderBottom:on?"2px solid "+G.gold:"2px solid transparent",padding:"11px 14px",cursor:"pointer",fontSize:13,fontFamily:"'Barlow',sans-serif",fontWeight:600,color:on?G.gold:G.muted,whiteSpace:"nowrap"});
const togSty = (on) => ({...base.ghost,background:on?"#1e2740":"transparent",color:on?G.text:G.muted,fontSize:12,padding:"6px 14px"});

function Badge({label,color}) {
  const cols={earthwork:G.gold,demolition:"#c05a3a",utilities:"#3a7fa5",equipment:"#5a4aa5",crew:"#3a8a5a",general:"#6a6a6a"};
  return <span style={{background:cols[color]||"#555",color:"#fff",fontSize:10,fontWeight:700,letterSpacing:0.8,padding:"2px 7px",borderRadius:3,textTransform:"uppercase"}}>{label}</span>;
}
function Stat({label,value,sub,gold}) {
  return (
    <div style={{...base.card,flex:1,minWidth:130}}>
      <div style={{color:G.dim,fontSize:10,letterSpacing:1.5,textTransform:"uppercase",marginBottom:7,fontWeight:700}}>{label}</div>
      <div style={{color:gold?G.gold:G.text,fontSize:20,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{value}</div>
      {sub && <div style={{color:"#2e3d55",fontSize:11,marginTop:4}}>{sub}</div>}
    </div>
  );
}
function DollarInput({value,onChange}) {
  return (
    <div style={{position:"relative"}}>
      <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:G.muted,fontSize:12,pointerEvents:"none"}}>$</span>
      <input type="number" value={value} onChange={e=>onChange(e.target.value)} min={0} step="0.01" style={{...base.input,paddingLeft:20}}/>
    </div>
  );
}

// ---- Job Intelligence Tool ----
function JobIntelligence() {
  const [step,      setStep]      = useState("setup");  // setup | searching | results
  const [jobDesc,   setJobDesc]   = useState("");
  const [location,  setLocation]  = useState("");
  const [categories,setCategories]= useState([]);
  const [results,   setResults]   = useState(null);
  const [error,     setError]     = useState("");

  const CATS = [
    { id:"materials", icon:"🧱", label:"Materials",      desc:"Pipe, CMU block, concrete, aggregate, lumber" },
    { id:"rentals",   icon:"🚜", label:"Equipment Rental",desc:"Excavators, compactors, trenchers, skid steers" },
    { id:"labor",     icon:"👷", label:"Labor / Crews",   desc:"Sub crews, operators, laborers, pipe layers" },
    { id:"suppliers", icon:"🏭", label:"Suppliers & Distributors", desc:"Wholesale, local supply houses, big box" },
    { id:"disposal",  icon:"🗑️", label:"Disposal & Hauling", desc:"Dump sites, haul trucks, debris removal" },
    { id:"permits",   icon:"📋", label:"Permits & Inspections", desc:"Building dept contacts, inspection fees, lead times" },
  ];

  function toggleCat(id) {
    setCategories(prev => prev.includes(id) ? prev.filter(c=>c!==id) : [...prev, id]);
  }

  async function runSearch() {
    if (!jobDesc.trim() || !location.trim() || categories.length === 0) return;
    setStep("searching"); setError("");

    const catLabels = categories.map(c => CATS.find(x=>x.id===c)?.label).join(", ");

    const systemPrompt = "You are an expert construction procurement specialist. A field superintendent needs to source everything for a job in " + location + ". " +
      "Based on your knowledge of the construction industry and typical vendors in that area, provide the most helpful sourcing guidance possible. " +
      "Include major national suppliers (Home Depot Pro, Sunbelt Rentals, United Rentals, Ferguson, etc) plus typical local supplier types. " +
      "Give realistic pricing ranges based on current market rates. Be specific and actionable. " +
      "Respond ONLY with a JSON object: {summary:string, location:string, categories:[{name:string, icon:string, vendors:[{name:string, type:string, phone:string, address:string, website:string, pricing:string, notes:string}]}]}";

    const userMsg = "Job scope: " + jobDesc.trim() + " Location: " + location + " Research these categories: " + catLabels + " Find the best local options with real names, phone numbers, and pricing.";

    try {
      const res = await fetch("/api/intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: userMsg }]
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const raw = (data.content || []).map(b => b.text || "").join("").trim();
      const a = raw.indexOf("{");
      const z = raw.lastIndexOf("}");
      if (a === -1) throw new Error("No results returned — try again.");

      const parsed = JSON.parse(raw.slice(a, z + 1));
      setResults(parsed);
      setStep("results");
    } catch (e) {
      setError(e.message || "Search failed");
      setStep("setup");
    }
  }

  const canSearch = jobDesc.trim() && location.trim() && categories.length > 0;

  const keySection = null;

  // ── SETUP SCREEN ──
  if (step === "setup") return (
    <div style={{maxWidth:660, margin:"0 auto"}}>
      <div style={{textAlign:"center", paddingTop:16, marginBottom:24}}>
        <div style={{fontSize:36, marginBottom:10}}>🔍</div>
        <h3 style={{margin:"0 0 6px", color:G.text, fontSize:20, fontWeight:700}}>Job Intelligence</h3>
        <p style={{color:G.muted, fontSize:14, margin:0, lineHeight:1.6}}>
          Describe your job and location. AI searches for real local vendors, current pricing, equipment rentals, crews, and suppliers — everything you need to push a bid out fast.
        </p>
      </div>

      {keySection}

      <div style={{...base.card, marginBottom:14}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14}}>
          <div>
            <label style={base.label}>Job Description</label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              rows={4}
              placeholder={"e.g. 200LF electrical trench, 40 inch deep, 4 inch PVC conduit, residential. Hand dig under CMU wall. Backfill and compact after inspection."}
              style={{...base.input, resize:"vertical", lineHeight:1.5, fontSize:13}}
            />
          </div>
          <div>
            <label style={base.label}>Location *</label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Phoenix, AZ"
              style={{...base.input, marginBottom:10}}
            />
            <label style={base.label}>What to Research</label>
            <div style={{display:"flex", flexDirection:"column", gap:6}}>
              {CATS.map(cat => (
                <button key={cat.id} onClick={()=>toggleCat(cat.id)} style={{
                  display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
                  borderRadius:6, border:"1px solid " + (categories.includes(cat.id) ? G.gold : "#1e2740"),
                  background: categories.includes(cat.id) ? "#1e2740" : "transparent",
                  cursor:"pointer", fontFamily:"'Barlow',sans-serif", textAlign:"left"
                }}>
                  <span style={{fontSize:16, flexShrink:0}}>{cat.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{color: categories.includes(cat.id) ? G.gold : G.text, fontSize:12, fontWeight:600}}>{cat.label}</div>
                    <div style={{color:G.dim, fontSize:10}}>{cat.desc}</div>
                  </div>
                  {categories.includes(cat.id) && <span style={{color:G.gold, fontSize:14}}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div style={{color:"#c05a3a", fontSize:13, padding:"10px 14px", background:"#1a0f0f", borderRadius:6, border:"1px solid #3a1e18", marginBottom:12}}>{error}</div>}

        <button onClick={runSearch} disabled={!canSearch} style={{...base.primary, width:"100%", padding:"13px", fontSize:15, opacity:canSearch?1:0.4}}>
          🔍 Search Local Vendors and Pricing
        </button>
        
      </div>
    </div>
  );

  // ── SEARCHING ──
  if (step === "searching") return (
    <div style={{maxWidth:500, margin:"0 auto", textAlign:"center", paddingTop:80}}>
      <div style={{fontSize:40, marginBottom:20}}>🔍</div>
      <div style={{color:G.text, fontSize:18, fontWeight:600, marginBottom:10}}>Searching your area...</div>
      <div style={{color:G.muted, fontSize:14, marginBottom:6}}>Finding vendors, pricing, and availability</div>
      <div style={{color:G.dim, fontSize:13}}>{location}</div>
      <div style={{display:"flex", justifyContent:"center", gap:8, marginTop:24}}>
        {[0,1,2,3,4].map(i=><div key={i} style={{width:10, height:10, borderRadius:"50%", background:G.gold, animation:"pulse 1.4s ease "+(i*0.15)+"s infinite"}}/>)}
      </div>
    </div>
  );

  // ── RESULTS ──
  return (
    <div style={{maxWidth:860, margin:"0 auto"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20}}>
        <div>
          <div style={{fontSize:11, color:G.gold, textTransform:"uppercase", letterSpacing:1.2, fontWeight:700, marginBottom:4}}>Job Intelligence Results</div>
          <div style={{color:G.text, fontSize:15, fontWeight:600}}>{results?.summary || jobDesc}</div>
          <div style={{color:G.muted, fontSize:12, marginTop:2}}>{results?.location || location}</div>
        </div>
        <button onClick={()=>{setStep("setup"); setResults(null);}} style={{...base.ghost, fontSize:12, padding:"7px 14px", flexShrink:0}}>
          ↺ New Search
        </button>
      </div>

      {(results?.categories || []).map((cat, ci) => (
        <div key={ci} style={{...base.card, marginBottom:16}}>
          <div style={{fontSize:15, fontWeight:700, color:G.text, marginBottom:14}}>
            {cat.icon || "📦"} {cat.name}
          </div>
          <div style={{display:"flex", flexDirection:"column", gap:10}}>
            {(cat.vendors || []).map((v, vi) => (
              <div key={vi} style={{background:G.bg, borderRadius:8, padding:"12px 14px", border:"1px solid #1e2740"}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap"}}>
                  <div style={{flex:1}}>
                    <div style={{color:G.text, fontWeight:700, fontSize:14, marginBottom:3}}>{v.name}</div>
                    <div style={{color:G.muted, fontSize:12, marginBottom:4}}>{v.type}</div>
                    <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
                      {v.phone && <a href={"tel:"+v.phone} style={{color:"#5b9bd5", fontSize:12, textDecoration:"none"}}>📞 {v.phone}</a>}
                      {v.address && <span style={{color:G.dim, fontSize:12}}>📍 {v.address}</span>}
                      {v.website && <a href={v.website} target="_blank" rel="noreferrer" style={{color:"#5b9bd5", fontSize:12, textDecoration:"none"}}>🌐 Website</a>}
                    </div>
                  </div>
                  {v.pricing && (
                    <div style={{background:"#1e2740", borderRadius:6, padding:"6px 12px", flexShrink:0}}>
                      <div style={{color:G.dim, fontSize:9, textTransform:"uppercase", letterSpacing:1, marginBottom:2}}>Pricing</div>
                      <div style={{color:G.gold, fontFamily:"'DM Mono',monospace", fontSize:13, fontWeight:700}}>{v.pricing}</div>
                    </div>
                  )}
                </div>
                {v.notes && <div style={{color:G.dim, fontSize:12, marginTop:8, paddingTop:8, borderTop:"1px solid #1e2740"}}>{v.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{...base.card, background:"#0c0f16", textAlign:"center", padding:"14px 20px"}}>
        <div style={{color:G.dim, fontSize:12}}>Results are AI-generated from web searches. Always verify pricing and availability directly with vendors before bidding.</div>
      </div>
    </div>
  );
}

// ---- Takeoff Tab ----
function TakeoffTab({proj,updateItem,removeItem,addCustom,totals}) {
  const [show,setShow] = useState(false);
  const [form,setForm] = useState({name:"",trade:"earthwork",unit:"CY",qty:0,material:0,labor:0,equipment:0});
  const [editName,setEditName] = useState(null);
  const setF = (f,v) => setForm(p=>({...p,[f]:v}));
  const ft = lnTot({qty:n2(form.qty),material:n2(form.material),labor:n2(form.labor),equipment:n2(form.equipment)});

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <span style={{color:G.muted,fontSize:13}}>{(proj.lineItems||[]).length} items</span>
        <button onClick={()=>setShow(s=>!s)} style={{...base.primary,fontSize:12,padding:"7px 16px"}}>{show?"Cancel":"+ Add Custom Item"}</button>
      </div>
      {show&&(
        <div style={{...base.card,marginBottom:18,border:"1px solid "+G.gold+"55"}}>
          <div style={{fontSize:11,color:G.gold,textTransform:"uppercase",letterSpacing:1.2,fontWeight:700,marginBottom:14}}>New Line Item</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 130px 100px",gap:10,marginBottom:10}}>
            <div><label style={base.label}>Description</label><input value={form.name} onChange={e=>setF("name",e.target.value)} placeholder="e.g. Import Fill" style={base.input}/></div>
            <div><label style={base.label}>Trade</label><select value={form.trade} onChange={e=>setF("trade",e.target.value)} style={base.input}>{TRADES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}</select></div>
            <div><label style={base.label}>Unit</label><select value={form.unit} onChange={e=>setF("unit",e.target.value)} style={base.input}>{UNITS.map(u=><option key={u} value={u}>{u}</option>)}</select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"90px 1fr 1fr 1fr 120px",gap:10,alignItems:"end",marginBottom:14}}>
            <div><label style={base.label}>Qty</label><input type="number" value={form.qty} onChange={e=>setF("qty",e.target.value)} min={0} style={base.input}/></div>
            <div><label style={base.label}>Material/Unit</label><DollarInput value={form.material} onChange={v=>setF("material",v)}/></div>
            <div><label style={base.label}>Labor/Unit</label><DollarInput value={form.labor} onChange={v=>setF("labor",v)}/></div>
            <div><label style={base.label}>Operating/Unit</label><DollarInput value={form.equipment} onChange={v=>setF("equipment",v)}/></div>
            <div><label style={base.label}>Line Total</label><div style={{background:G.bg,border:"1px solid #1e2740",borderRadius:6,padding:"7px 10px",color:G.gold,fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:700}}>{fmt(ft)}</div></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{if(!form.name.trim())return;addCustom({...form,id:uid(),qty:n2(form.qty),material:n2(form.material),labor:n2(form.labor),equipment:n2(form.equipment)});setForm({name:"",trade:"earthwork",unit:"CY",qty:0,material:0,labor:0,equipment:0});setShow(false);}} disabled={!form.name.trim()} style={{...base.primary,opacity:form.name.trim()?1:0.4}}>Add to Takeoff</button>
            <button onClick={()=>setShow(false)} style={base.ghost}>Cancel</button>
          </div>
        </div>
      )}
      {(proj.lineItems||[]).length===0&&!show?(
        <div style={{textAlign:"center",padding:60,color:G.dim}}>
          <div style={{fontSize:32,marginBottom:12}}>📋</div>
          <div style={{marginBottom:12}}>No items yet.</div>
          <button onClick={()=>setShow(true)} style={base.primary}>+ Add Custom Item</button>
        </div>
      ):(proj.lineItems||[]).length>0&&(
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr>{["Trade","Description","Unit","Qty","Material","Labor","Operating","Total",""].map(h=><th key={h} style={base.th}>{h}</th>)}</tr></thead>
            <tbody>
              {(proj.lineItems||[]).map(item=>(
                <tr key={item.id}>
                  <td style={base.td}><Badge label={item.trade} color={item.trade}/></td>
                  <td style={base.td}>
                    {editName===item.id
                      ?<input autoFocus value={item.name} onChange={e=>updateItem(item.id,"name",e.target.value)} onBlur={()=>setEditName(null)} onKeyDown={e=>e.key==="Enter"&&setEditName(null)} style={{...base.cinput,width:180}}/>
                      :<span style={{color:"#ccd3e0",cursor:"text"}} onClick={()=>setEditName(item.id)}>{item.name}</span>
                    }
                  </td>
                  <td style={{...base.td,color:G.muted}}>{item.unit}</td>
                  <td style={base.td}><input type="number" value={item.qty} onChange={e=>updateItem(item.id,"qty",e.target.value)} style={base.cinput} min={0}/></td>
                  {["material","labor","equipment"].map(f=>(
                    <td key={f} style={base.td}>
                      <div style={{position:"relative"}}>
                        <span style={{position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",color:G.muted,fontSize:11,pointerEvents:"none"}}>$</span>
                        <input type="number" value={item[f]} onChange={e=>updateItem(item.id,f,e.target.value)} style={{...base.cinput,paddingLeft:16}} min={0} step="0.01"/>
                      </div>
                    </td>
                  ))}
                  <td style={{...base.td,color:G.gold,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmt(lnTot(item))}</td>
                  <td style={base.td}><button onClick={()=>removeItem(item.id)} style={base.icon}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:20}}>
            <div style={{...base.card,minWidth:300}}>
              {[["Takeoff Subtotal",fmt(totals.li)],["Markup ("+proj.markup+"%)",fmt(totals.mu)],["Tax ("+proj.tax+"%)",fmt(totals.tx)]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13,color:"#6b7a99"}}><span>{l}</span><span style={{fontFamily:"'DM Mono',monospace"}}>{v}</span></div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0 0",marginTop:6,borderTop:"1px solid #1e2740",fontWeight:700,fontSize:17}}>
                <span style={{color:G.text}}>TOTAL BID</span><span style={{color:G.gold,fontFamily:"'DM Mono',monospace"}}>{fmt(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Library Tab ----
function LibraryTab({library,setLibrary,proj,addItem}) {
  const [trade,setTrade]   = useState("earthwork");
  const [search,setSearch] = useState("");
  const [show,setShow]     = useState(false);
  const [nItem,setNItem]   = useState({name:"",unit:"CY",material:0,labor:0,equipment:0});
  const [editId,setEditId] = useState(null);
  const [eBuf,setEBuf]     = useState({});
  const filtered = (library[trade]||[]).filter(i=>i.name.toLowerCase().includes(search.toLowerCase()));

  const saveNew = () => {
    if(!nItem.name.trim()) return;
    setLibrary(lib=>({...lib,[trade]:[...(lib[trade]||[]),{...nItem,id:uid(),material:n2(nItem.material),labor:n2(nItem.labor),equipment:n2(nItem.equipment)}]}));
    setNItem({name:"",unit:"CY",material:0,labor:0,equipment:0}); setShow(false);
  };
  const saveEdit = () => {
    setLibrary(lib=>({...lib,[trade]:lib[trade].map(i=>i.id===editId?{...eBuf,material:n2(eBuf.material),labor:n2(eBuf.labor),equipment:n2(eBuf.equipment)}:i)}));
    setEditId(null);
  };
  const del = (id) => setLibrary(lib=>({...lib,[trade]:lib[trade].filter(i=>i.id!==id)}));

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:6}}>
          {Object.keys(library).map(t=><button key={t} onClick={()=>{setTrade(t);setShow(false);setEditId(null);}} style={togSty(trade===t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
        </div>
        <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{...base.input,width:160,padding:"6px 12px",marginLeft:"auto"}}/>
        <button onClick={()=>{setShow(s=>!s);setEditId(null);}} style={{...base.primary,fontSize:12,padding:"7px 14px"}}>{show?"Cancel":"+ New "+trade.charAt(0).toUpperCase()+trade.slice(1)+" Item"}</button>
      </div>
      {show&&(
        <div style={{...base.card,marginBottom:16,border:"1px solid "+G.gold+"55"}}>
          <div style={{fontSize:11,color:G.gold,textTransform:"uppercase",letterSpacing:1.2,fontWeight:700,marginBottom:12}}>Add to {trade} Library</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 90px 1fr 1fr 1fr",gap:10,marginBottom:12}}>
            <div><label style={base.label}>Name</label><input value={nItem.name} onChange={e=>setNItem(p=>({...p,name:e.target.value}))} placeholder="Item name" style={base.input}/></div>
            <div><label style={base.label}>Unit</label><select value={nItem.unit} onChange={e=>setNItem(p=>({...p,unit:e.target.value}))} style={base.input}>{UNITS.map(u=><option key={u} value={u}>{u}</option>)}</select></div>
            <div><label style={base.label}>Material/Unit</label><DollarInput value={nItem.material} onChange={v=>setNItem(p=>({...p,material:v}))}/></div>
            <div><label style={base.label}>Labor/Unit</label><DollarInput value={nItem.labor} onChange={v=>setNItem(p=>({...p,labor:v}))}/></div>
            <div><label style={base.label}>Operating/Unit</label><DollarInput value={nItem.equipment} onChange={v=>setNItem(p=>({...p,equipment:v}))}/></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={saveNew} disabled={!nItem.name.trim()} style={{...base.primary,opacity:nItem.name.trim()?1:0.4}}>Save to Library</button>
            <button onClick={()=>setShow(false)} style={base.ghost}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {filtered.length===0&&<div style={{textAlign:"center",padding:48,color:G.dim}}><div style={{fontSize:28,marginBottom:10}}>📂</div><div>{search?"No items match":"No "+trade+" items yet."}</div></div>}
        {filtered.map(item=>{
          const onJob=(proj.lineItems||[]).some(l=>l.name===item.name&&l.trade===trade);
          if(editId===item.id) return (
            <div key={item.id} style={{...base.card,border:"1px solid "+G.gold+"88"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 90px 1fr 1fr 1fr",gap:10,marginBottom:10}}>
                <div><label style={base.label}>Name</label><input value={eBuf.name} onChange={e=>setEBuf(b=>({...b,name:e.target.value}))} style={base.input}/></div>
                <div><label style={base.label}>Unit</label><select value={eBuf.unit} onChange={e=>setEBuf(b=>({...b,unit:e.target.value}))} style={base.input}>{UNITS.map(u=><option key={u} value={u}>{u}</option>)}</select></div>
                <div><label style={base.label}>Material</label><DollarInput value={eBuf.material} onChange={v=>setEBuf(b=>({...b,material:v}))}/></div>
                <div><label style={base.label}>Labor</label><DollarInput value={eBuf.labor} onChange={v=>setEBuf(b=>({...b,labor:v}))}/></div>
                <div><label style={base.label}>Operating</label><DollarInput value={eBuf.equipment} onChange={v=>setEBuf(b=>({...b,equipment:v}))}/></div>
              </div>
              <div style={{display:"flex",gap:8}}><button onClick={saveEdit} style={base.primary}>Save Changes</button><button onClick={()=>setEditId(null)} style={base.ghost}>Cancel</button></div>
            </div>
          );
          return (
            <div key={item.id} style={{...base.card,display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{color:"#ccd3e0",fontWeight:500,marginBottom:3}}>{item.name}</div>
                <div style={{color:G.dim,fontSize:11,display:"flex",gap:12}}>
                  <span>Mat: <span style={{color:"#6b7a99"}}>{fmt(item.material)}</span></span>
                  <span>Labor: <span style={{color:"#6b7a99"}}>{fmt(item.labor)}</span></span>
                  <span>Oper: <span style={{color:"#6b7a99"}}>{fmt(item.equipment)}</span></span>
                  <span>/{item.unit}</span>
                </div>
              </div>
              <div style={{color:G.gold,fontFamily:"'DM Mono',monospace",fontSize:13,minWidth:90,textAlign:"right"}}>{fmt(item.material+item.labor+item.equipment)}/{item.unit}</div>
              <button onClick={()=>{setEditId(item.id);setEBuf({...item});setShow(false);}} style={{...base.ghost,padding:"5px 12px",fontSize:12}}>Edit</button>
              <button onClick={()=>{if(!onJob)addItem(item,trade);}} disabled={onJob} style={{...base.primary,padding:"5px 14px",fontSize:12,opacity:onJob?0.4:1}}>{onJob?"Added":"+ Add"}</button>
              <button onClick={()=>del(item.id)} style={base.icon}>🗑</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Equipment Tab ----
function EquipmentTab({items,onChange,catalog,setCatalog}) {
  const [panel,setPanel] = useState("catalog");
  const [show,setShow]   = useState(false);
  const [nEq,setNEq]     = useState({name:"",type:"General",dayRate:0,weekRate:0,mobilization:0});
  const [editId,setEditId] = useState(null);
  const [eBuf,setEBuf]   = useState({});

  const saveNew = () => {
    if(!nEq.name.trim()) return;
    setCatalog(c=>[...c,{...nEq,id:uid(),dayRate:n2(nEq.dayRate),weekRate:n2(nEq.weekRate),mobilization:n2(nEq.mobilization)}]);
    setNEq({name:"",type:"General",dayRate:0,weekRate:0,mobilization:0}); setShow(false);
  };
  const saveEdit = () => {
    setCatalog(c=>c.map(i=>i.id===editId?{...eBuf,dayRate:n2(eBuf.dayRate),weekRate:n2(eBuf.weekRate),mobilization:n2(eBuf.mobilization)}:i));
    setEditId(null);
  };
  const addJob = (eq) => onChange([...items,{...eq,id:uid(),rentalType:"day",days:1,weeks:0}]);
  const remJob = (id) => onChange(items.filter(i=>i.id!==id));
  const updJob = (id,f,v) => onChange(items.map(i=>i.id===id?{...i,[f]:["days","weeks"].includes(f)?parseInt(v)||0:n2(v)}:i));
  const total  = items.reduce((s,i)=>s+eqTot(i),0);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{color:G.text,fontSize:16,fontWeight:700}}>Equipment</div><div style={{color:G.muted,fontSize:12,marginTop:2}}>Manage catalog then add to this job.</div></div>
        <div style={{color:G.gold,fontFamily:"'DM Mono',monospace",fontSize:18,fontWeight:700}}>{fmt(total)}</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        <button onClick={()=>setPanel("catalog")} style={togSty(panel==="catalog")}>Catalog</button>
        <button onClick={()=>setPanel("active")} style={togSty(panel==="active")}>
          On This Job {items.length>0&&<span style={{background:G.gold,color:"#080b10",borderRadius:10,padding:"1px 6px",fontSize:10,marginLeft:4}}>{items.length}</span>}
        </button>
      </div>

      {panel==="catalog"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
            <button onClick={()=>{setShow(s=>!s);setEditId(null);}} style={{...base.primary,fontSize:12,padding:"7px 14px"}}>{show?"Cancel":"+ New Equipment"}</button>
          </div>
          {show&&(
            <div style={{...base.card,marginBottom:14,border:"1px solid "+G.gold+"55"}}>
              <div style={{fontSize:11,color:G.gold,textTransform:"uppercase",letterSpacing:1.2,fontWeight:700,marginBottom:12}}>New Equipment</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 160px 1fr 1fr 1fr",gap:10,marginBottom:12}}>
                <div><label style={base.label}>Name</label><input value={nEq.name} onChange={e=>setNEq(p=>({...p,name:e.target.value}))} placeholder="e.g. Mini Excavator" style={base.input}/></div>
                <div><label style={base.label}>Type</label><select value={nEq.type} onChange={e=>setNEq(p=>({...p,type:e.target.value}))} style={base.input}>{EQTYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
                <div><label style={base.label}>Day Rate</label><DollarInput value={nEq.dayRate} onChange={v=>setNEq(p=>({...p,dayRate:v}))}/></div>
                <div><label style={base.label}>Week Rate</label><DollarInput value={nEq.weekRate} onChange={v=>setNEq(p=>({...p,weekRate:v}))}/></div>
                <div><label style={base.label}>Mobilization</label><DollarInput value={nEq.mobilization} onChange={v=>setNEq(p=>({...p,mobilization:v}))}/></div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={saveNew} disabled={!nEq.name.trim()} style={{...base.primary,opacity:nEq.name.trim()?1:0.4}}>Save to Catalog</button>
                <button onClick={()=>setShow(false)} style={base.ghost}>Cancel</button>
              </div>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {catalog.map(eq=>{
              const onJob=items.some(i=>i.name===eq.name);
              if(editId===eq.id) return (
                <div key={eq.id} style={{...base.card,border:"1px solid "+G.gold+"88"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 160px 1fr 1fr 1fr",gap:10,marginBottom:10}}>
                    <div><label style={base.label}>Name</label><input value={eBuf.name} onChange={e=>setEBuf(b=>({...b,name:e.target.value}))} style={base.input}/></div>
                    <div><label style={base.label}>Type</label><select value={eBuf.type} onChange={e=>setEBuf(b=>({...b,type:e.target.value}))} style={base.input}>{EQTYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
                    <div><label style={base.label}>Day Rate</label><DollarInput value={eBuf.dayRate} onChange={v=>setEBuf(b=>({...b,dayRate:v}))}/></div>
                    <div><label style={base.label}>Week Rate</label><DollarInput value={eBuf.weekRate} onChange={v=>setEBuf(b=>({...b,weekRate:v}))}/></div>
                    <div><label style={base.label}>Mobilization</label><DollarInput value={eBuf.mobilization} onChange={v=>setEBuf(b=>({...b,mobilization:v}))}/></div>
                  </div>
                  <div style={{display:"flex",gap:8}}><button onClick={saveEdit} style={base.primary}>Save Changes</button><button onClick={()=>setEditId(null)} style={base.ghost}>Cancel</button></div>
                </div>
              );
              return (
                <div key={eq.id} style={{...base.card,display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{color:"#ccd3e0",fontWeight:500,marginBottom:3}}>{eq.name}</div>
                    <div style={{color:G.dim,fontSize:11,display:"flex",gap:12}}>
                      <span>Type: <span style={{color:"#6b7a99"}}>{eq.type}</span></span>
                      <span>Day: <span style={{color:"#6b7a99"}}>{fmt(eq.dayRate)}</span></span>
                      <span>Week: <span style={{color:"#6b7a99"}}>{fmt(eq.weekRate)}</span></span>
                    </div>
                  </div>
                  <button onClick={()=>{setEditId(eq.id);setEBuf({...eq});setShow(false);}} style={{...base.ghost,padding:"5px 12px",fontSize:12}}>Edit</button>
                  <button onClick={()=>{if(!onJob)addJob(eq);}} disabled={onJob} style={{...base.primary,padding:"5px 14px",fontSize:12,opacity:onJob?0.4:1}}>{onJob?"On Job":"+ Add"}</button>
                  <button onClick={()=>setCatalog(c=>c.filter(i=>i.id!==eq.id))} style={base.icon}>🗑</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {panel==="active"&&(
        items.length===0
          ?<div style={{textAlign:"center",padding:48,color:G.dim}}><div style={{fontSize:28,marginBottom:10}}>🚜</div><div style={{marginBottom:12}}>No equipment added.</div><button onClick={()=>setPanel("catalog")} style={base.primary}>Go to Catalog</button></div>
          :<div style={base.card}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Equipment","Type","Period","Duration","Day Rate","Week Rate","Mob","Total",""].map(h=><th key={h} style={base.th}>{h}</th>)}</tr></thead>
              <tbody>
                {items.map(item=>(
                  <tr key={item.id}>
                    <td style={{...base.td,color:"#ccd3e0",fontWeight:500}}>{item.name}</td>
                    <td style={{...base.td,color:G.muted,fontSize:12}}>{item.type}</td>
                    <td style={base.td}><select value={item.rentalType} onChange={e=>updJob(item.id,"rentalType",e.target.value)} style={{...base.input,width:75,padding:"4px 6px",fontSize:12}}><option value="day">Daily</option><option value="week">Weekly</option></select></td>
                    <td style={base.td}><input type="number" value={item.rentalType==="day"?item.days:item.weeks} onChange={e=>updJob(item.id,item.rentalType==="day"?"days":"weeks",e.target.value)} style={{...base.cinput,width:55}} min={0}/></td>
                    {["dayRate","weekRate","mobilization"].map(f=>(
                      <td key={f} style={base.td}>
                        <div style={{position:"relative"}}><span style={{position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",color:G.muted,fontSize:11,pointerEvents:"none"}}>$</span><input type="number" value={item[f]} onChange={e=>updJob(item.id,f,e.target.value)} style={{...base.cinput,width:75,paddingLeft:16}} min={0}/></div>
                      </td>
                    ))}
                    <td style={{...base.td,color:G.gold,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmt(eqTot(item))}</td>
                    <td style={base.td}><button onClick={()=>remJob(item.id)} style={base.icon}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid #1e2740",display:"flex",justifyContent:"flex-end"}}>
              <span style={{color:G.gold,fontFamily:"'DM Mono',monospace",fontSize:16,fontWeight:700}}>Total: {fmt(total)}</span>
            </div>
          </div>
      )}
    </div>
  );
}

// ---- Crew Tab ----
function CrewTab({items,onChange,catalog,setCatalog}) {
  const [panel,setPanel] = useState("catalog");
  const [show,setShow]   = useState(false);
  const [nRole,setNRole] = useState({name:"",hourlyRate:0,defaultHours:8});
  const [editId,setEditId] = useState(null);
  const [eBuf,setEBuf]   = useState({});

  const saveNew = () => {
    if(!nRole.name.trim()) return;
    setCatalog(c=>[...c,{...nRole,id:uid(),hourlyRate:n2(nRole.hourlyRate),defaultHours:n2(nRole.defaultHours)||8}]);
    setNRole({name:"",hourlyRate:0,defaultHours:8}); setShow(false);
  };
  const saveEdit = () => {
    setCatalog(c=>c.map(i=>i.id===editId?{...eBuf,hourlyRate:n2(eBuf.hourlyRate),defaultHours:n2(eBuf.defaultHours)||8}:i));
    setEditId(null);
  };
  const addJob = (r) => onChange([...items,{...r,id:uid(),hours:r.defaultHours,days:1,workers:1}]);
  const remJob = (id) => onChange(items.filter(i=>i.id!==id));
  const updJob = (id,f,v) => onChange(items.map(i=>i.id===id?{...i,[f]:n2(v)}:i));
  const total   = items.reduce((s,i)=>s+crTot(i),0);
  const workers = items.reduce((s,i)=>s+n2(i.workers||1),0);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{color:G.text,fontSize:16,fontWeight:700}}>Crew</div><div style={{color:G.muted,fontSize:12,marginTop:2}}>Manage catalog then assign to this job.</div></div>
        <div style={{textAlign:"right"}}>
          <div style={{color:G.gold,fontFamily:"'DM Mono',monospace",fontSize:18,fontWeight:700}}>{fmt(total)}</div>
          {workers>0&&<div style={{color:G.dim,fontSize:11}}>{workers} workers</div>}
        </div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        <button onClick={()=>setPanel("catalog")} style={togSty(panel==="catalog")}>Catalog</button>
        <button onClick={()=>setPanel("active")} style={togSty(panel==="active")}>
          On This Job {items.length>0&&<span style={{background:G.gold,color:"#080b10",borderRadius:10,padding:"1px 6px",fontSize:10,marginLeft:4}}>{items.length}</span>}
        </button>
      </div>

      {panel==="catalog"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
            <button onClick={()=>{setShow(s=>!s);setEditId(null);}} style={{...base.primary,fontSize:12,padding:"7px 14px"}}>{show?"Cancel":"+ New Role"}</button>
          </div>
          {show&&(
            <div style={{...base.card,marginBottom:14,border:"1px solid "+G.gold+"55"}}>
              <div style={{fontSize:11,color:G.gold,textTransform:"uppercase",letterSpacing:1.2,fontWeight:700,marginBottom:12}}>New Crew Role</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 160px 140px",gap:10,marginBottom:12}}>
                <div><label style={base.label}>Role</label><input value={nRole.name} onChange={e=>setNRole(p=>({...p,name:e.target.value}))} placeholder="e.g. CMU Mason" style={base.input}/></div>
                <div><label style={base.label}>Hourly Rate</label><DollarInput value={nRole.hourlyRate} onChange={v=>setNRole(p=>({...p,hourlyRate:v}))}/></div>
                <div><label style={base.label}>Default Hrs/Day</label><input type="number" value={nRole.defaultHours} onChange={e=>setNRole(p=>({...p,defaultHours:e.target.value}))} min={1} max={24} style={base.input}/></div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={saveNew} disabled={!nRole.name.trim()} style={{...base.primary,opacity:nRole.name.trim()?1:0.4}}>Save to Catalog</button>
                <button onClick={()=>setShow(false)} style={base.ghost}>Cancel</button>
              </div>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {catalog.map(role=>{
              const onJob=items.some(i=>i.name===role.name);
              if(editId===role.id) return (
                <div key={role.id} style={{...base.card,border:"1px solid "+G.gold+"88"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 160px 140px",gap:10,marginBottom:10}}>
                    <div><label style={base.label}>Role</label><input value={eBuf.name} onChange={e=>setEBuf(b=>({...b,name:e.target.value}))} style={base.input}/></div>
                    <div><label style={base.label}>Hourly Rate</label><DollarInput value={eBuf.hourlyRate} onChange={v=>setEBuf(b=>({...b,hourlyRate:v}))}/></div>
                    <div><label style={base.label}>Default Hrs/Day</label><input type="number" value={eBuf.defaultHours} onChange={e=>setEBuf(b=>({...b,defaultHours:e.target.value}))} min={1} max={24} style={base.input}/></div>
                  </div>
                  <div style={{display:"flex",gap:8}}><button onClick={saveEdit} style={base.primary}>Save Changes</button><button onClick={()=>setEditId(null)} style={base.ghost}>Cancel</button></div>
                </div>
              );
              return (
                <div key={role.id} style={{...base.card,display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{color:"#ccd3e0",fontWeight:500,marginBottom:3}}>{role.name}</div>
                    <div style={{color:G.dim,fontSize:11}}>${role.hourlyRate}/hr &bull; {role.defaultHours} hrs/day default</div>
                  </div>
                  <button onClick={()=>{setEditId(role.id);setEBuf({...role});setShow(false);}} style={{...base.ghost,padding:"5px 12px",fontSize:12}}>Edit</button>
                  <button onClick={()=>{if(!onJob)addJob(role);}} disabled={onJob} style={{...base.primary,padding:"5px 14px",fontSize:12,opacity:onJob?0.4:1}}>{onJob?"On Job":"+ Add"}</button>
                  <button onClick={()=>setCatalog(c=>c.filter(i=>i.id!==role.id))} style={base.icon}>🗑</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {panel==="active"&&(
        items.length===0
          ?<div style={{textAlign:"center",padding:48,color:G.dim}}><div style={{fontSize:28,marginBottom:10}}>👷</div><div style={{marginBottom:12}}>No crew assigned.</div><button onClick={()=>setPanel("catalog")} style={base.primary}>Go to Catalog</button></div>
          :<div style={base.card}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Role","Rate/hr","Workers","Hrs/Day","Days","Total",""].map(h=><th key={h} style={base.th}>{h}</th>)}</tr></thead>
              <tbody>
                {items.map(item=>(
                  <tr key={item.id}>
                    <td style={{...base.td,color:"#ccd3e0",fontWeight:500}}>{item.name}</td>
                    <td style={base.td}><div style={{position:"relative"}}><span style={{position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",color:G.muted,fontSize:11,pointerEvents:"none"}}>$</span><input type="number" value={item.hourlyRate} onChange={e=>updJob(item.id,"hourlyRate",e.target.value)} style={{...base.cinput,width:65,paddingLeft:16}} min={0}/></div></td>
                    {["workers","hours","days"].map(f=><td key={f} style={base.td}><input type="number" value={item[f]} onChange={e=>updJob(item.id,f,e.target.value)} style={{...base.cinput,width:55}} min={0}/></td>)}
                    <td style={{...base.td,color:G.gold,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{fmt(crTot(item))}</td>
                    <td style={base.td}><button onClick={()=>remJob(item.id)} style={base.icon}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid #1e2740",display:"flex",justifyContent:"space-between",fontSize:12,color:G.muted}}>
              <span>Crew: <strong style={{color:G.text}}>{workers} workers</strong></span>
              <span style={{color:G.gold,fontFamily:"'DM Mono',monospace",fontSize:15,fontWeight:700}}>Total: {fmt(total)}</span>
            </div>
          </div>
      )}
    </div>
  );
}

// ---- Word Document Export ----
async function exportDocx(proj) {
  // Dynamic import so the app loads even without the package (e.g. in preview)
  let docxLib;
  try {
    docxLib = await import("docx");
  } catch(e) {
    alert("Word export requires the deployed version of FIELDEST. The app preview does not support this library.");
    return;
  }
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType } = docxLib;
  const {li,eq,cr,sub,mu,tx,total} = tots(proj);
  const n2l = (v) => parseFloat(v)||0;
  const GOLD = "C8A84B";
  const DARK = "0E1117";

  const cell = (text, opts={}) => new TableCell({
    width: { size: opts.width||20, type: WidthType.PERCENTAGE },
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.SOLID } : undefined,
    children: [new Paragraph({
      alignment: opts.align||AlignmentType.LEFT,
      children: [new TextRun({ text: String(text), bold: !!opts.bold, color: opts.color, size: opts.size||20 })]
    })]
  });

  const headerRow = (cols, shade) => new TableRow({
    children: cols.map((c,i)=>cell(c, {bold:true, shade, color:"FFFFFF", align: i>1?AlignmentType.RIGHT:AlignmentType.LEFT, size:18}))
  });

  const dataRow = (cols, boldLast) => new TableRow({
    children: cols.map((c,i)=>cell(c, {align: i>1?AlignmentType.RIGHT:AlignmentType.LEFT, bold: boldLast && i===cols.length-1}))
  });

  const sections = [];

  // Title block
  sections.push(
    new Paragraph({ children:[new TextRun({text:"BID PROPOSAL", bold:true, size:48})], spacing:{after:80} }),
    new Paragraph({ children:[new TextRun({text:"Earthwork  ·  Demolition  ·  Underground Utilities", italics:true, color:"666666", size:20})], spacing:{after:300} }),
  );

  // Client / project info
  sections.push(
    new Table({
      width:{size:100,type:WidthType.PERCENTAGE},
      borders: { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE}, insideHorizontal:{style:BorderStyle.NONE}, insideVertical:{style:BorderStyle.NONE} },
      rows:[ new TableRow({ children:[
        new TableCell({ width:{size:50,type:WidthType.PERCENTAGE}, children:[
          new Paragraph({children:[new TextRun({text:"SUBMITTED TO", bold:true, size:16, color:"999999"})]}),
          new Paragraph({children:[new TextRun({text:proj.client||"Client Name", bold:true, size:24})], spacing:{before:60}}),
          new Paragraph({children:[new TextRun({text:proj.address||"", size:20, color:"666666"})]}),
        ]}),
        new TableCell({ width:{size:50,type:WidthType.PERCENTAGE}, children:[
          new Paragraph({children:[new TextRun({text:"PROJECT DETAILS", bold:true, size:16, color:"999999"})]}),
          new Paragraph({children:[new TextRun({text:"Project: ", bold:true, size:20}), new TextRun({text:proj.name||"—", size:20})], spacing:{before:60}}),
          new Paragraph({children:[new TextRun({text:"Type: ", bold:true, size:20}), new TextRun({text:(proj.type||"").charAt(0).toUpperCase()+(proj.type||"").slice(1), size:20})]}),
          new Paragraph({children:[new TextRun({text:"Date: ", bold:true, size:20}), new TextRun({text:proj.date||"", size:20})]}),
        ]}),
      ]})]
    }),
    new Paragraph({ text:"", spacing:{after:300} })
  );

  // Trade sections
  TRADES.forEach(trade => {
    const its = (proj.lineItems||[]).filter(l=>l.trade===trade);
    if(!its.length) return;
    const tt = its.reduce((s,i)=>s+lnTot(i),0);
    sections.push(
      new Paragraph({ text:"", spacing:{before:200} }),
      new Table({
        width:{size:100,type:WidthType.PERCENTAGE},
        rows:[
          new TableRow({ children:[
            new TableCell({ width:{size:70,type:WidthType.PERCENTAGE}, shading:{fill:DARK,type:ShadingType.SOLID}, children:[new Paragraph({children:[new TextRun({text:trade.toUpperCase(), bold:true, color:"FFFFFF", size:18})]})]}),
            new TableCell({ width:{size:30,type:WidthType.PERCENTAGE}, shading:{fill:DARK,type:ShadingType.SOLID}, children:[new Paragraph({alignment:AlignmentType.RIGHT, children:[new TextRun({text:fmt(tt), bold:true, color:"FFFFFF", size:18})]})]}),
          ]}),
          headerRow(["Description","Qty","Unit","Unit Price","Total"], "F5F5F5"),
          ...its.map(i=>dataRow([i.name, String(i.qty), i.unit, fmt(n2l(i.material)+n2l(i.labor)+n2l(i.equipment)), fmt(lnTot(i))], true)),
        ]
      })
    );
  });

  // Equipment
  if((proj.equipmentItems||[]).length) {
    sections.push(
      new Paragraph({ text:"", spacing:{before:200} }),
      new Table({
        width:{size:100,type:WidthType.PERCENTAGE},
        rows:[
          new TableRow({ children:[
            new TableCell({ width:{size:70,type:WidthType.PERCENTAGE}, shading:{fill:"2D1F4A",type:ShadingType.SOLID}, children:[new Paragraph({children:[new TextRun({text:"EQUIPMENT", bold:true, color:"FFFFFF", size:18})]})]}),
            new TableCell({ width:{size:30,type:WidthType.PERCENTAGE}, shading:{fill:"2D1F4A",type:ShadingType.SOLID}, children:[new Paragraph({alignment:AlignmentType.RIGHT, children:[new TextRun({text:fmt(eq), bold:true, color:"FFFFFF", size:18})]})]}),
          ]}),
          headerRow(["Equipment","Duration","Rate","Mob","Total"], "F5F5F5"),
          ...proj.equipmentItems.map(i=>dataRow([
            i.name,
            i.rentalType==="day"?i.days+" days":i.weeks+" weeks",
            fmt(i.rentalType==="day"?i.dayRate:i.weekRate)+"/"+i.rentalType,
            fmt(i.mobilization),
            fmt(eqTot(i))
          ], true)),
        ]
      })
    );
  }

  // Crew
  if((proj.crewItems||[]).length) {
    sections.push(
      new Paragraph({ text:"", spacing:{before:200} }),
      new Table({
        width:{size:100,type:WidthType.PERCENTAGE},
        rows:[
          new TableRow({ children:[
            new TableCell({ width:{size:70,type:WidthType.PERCENTAGE}, shading:{fill:"1A3A2A",type:ShadingType.SOLID}, children:[new Paragraph({children:[new TextRun({text:"CREW LABOR", bold:true, color:"FFFFFF", size:18})]})]}),
            new TableCell({ width:{size:30,type:WidthType.PERCENTAGE}, shading:{fill:"1A3A2A",type:ShadingType.SOLID}, children:[new Paragraph({alignment:AlignmentType.RIGHT, children:[new TextRun({text:fmt(cr), bold:true, color:"FFFFFF", size:18})]})]}),
          ]}),
          headerRow(["Role","Workers","Hrs/Day","Days","Rate/hr","Total"], "F5F5F5"),
          ...proj.crewItems.map(i=>dataRow([
            i.name, String(i.workers||1), String(i.hours), String(i.days), "$"+i.hourlyRate+"/hr", fmt(crTot(i))
          ], true)),
        ]
      })
    );
  }

  // Totals
  sections.push(
    new Paragraph({ text:"", spacing:{before:300} }),
    new Table({
      width:{size:40,type:WidthType.PERCENTAGE},
      alignment: AlignmentType.RIGHT,
      borders: { top:{style:BorderStyle.SINGLE,size:6}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE}, insideHorizontal:{style:BorderStyle.NONE}, insideVertical:{style:BorderStyle.NONE} },
      rows:[
        new TableRow({ children:[cell("Subtotal",{width:60}), cell(fmt(sub),{width:40,align:AlignmentType.RIGHT})]}),
        new TableRow({ children:[cell("Markup ("+proj.markup+"%)",{width:60}), cell(fmt(mu),{width:40,align:AlignmentType.RIGHT})]}),
        new TableRow({ children:[cell("Tax ("+proj.tax+"%)",{width:60}), cell(fmt(tx),{width:40,align:AlignmentType.RIGHT})]}),
        new TableRow({ children:[cell("TOTAL BID",{width:60,bold:true,size:24}), cell(fmt(total),{width:40,align:AlignmentType.RIGHT,bold:true,size:24,color:"C8A84B"})]}),
      ]
    })
  );

  if(proj.notes) {
    sections.push(
      new Paragraph({ text:"", spacing:{before:300} }),
      new Paragraph({ children:[new TextRun({text:"Notes: ", bold:true, size:18}), new TextRun({text:proj.notes, size:18, color:"555555"})] })
    );
  }

  sections.push(
    new Paragraph({ text:"", spacing:{before:400} }),
    new Table({
      width:{size:100,type:WidthType.PERCENTAGE},
      borders: { top:{style:BorderStyle.SINGLE,size:4,color:"CCCCCC"}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE}, insideHorizontal:{style:BorderStyle.NONE}, insideVertical:{style:BorderStyle.NONE} },
      rows:[ new TableRow({ children:[
        cell("Proposal valid 30 days.", {width:50, size:16, color:"999999"}),
        cell("Authorized: ___________________", {width:50, align:AlignmentType.RIGHT, size:16, color:"999999"}),
      ]})]
    })
  );

  const doc = new Document({
    sections: [{ properties:{}, children: sections }]
  });

  const blob = await Packer.toBlob(doc);
  const filename = (proj.name||"bid-proposal").replace(/[^a-z0-9]+/gi,"-") + ".docx";
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// ---- Proposal ----
function ProposalView({proj}) {
  const {li,eq,cr,sub,mu,tx,total} = tots(proj);
  const [exporting, setExporting] = useState(false);
  const n2l = (v) => parseFloat(v)||0;
  const thS = {padding:"6px 10px",textAlign:"left",color:"#777",fontWeight:700,fontSize:10};

  async function handleExport() {
    setExporting(true);
    try { await exportDocx(proj); }
    catch(e) { alert("Export failed: " + e.message); }
    setExporting(false);
  }

  return (
    <div>
      {/* Action buttons */}
      <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:20,flexWrap:"wrap"}}>
        <button onClick={handleExport} disabled={exporting} style={{...base.primary, opacity:exporting?0.6:1}}>
          {exporting ? "Generating..." : "📄 Download Word Document"}
        </button>
        <button onClick={()=>exportCSV(proj)} style={{...base.ghost,borderColor:"#3a7fa5",color:"#5b9bd5"}}>
          📊 Download CSV
        </button>
      </div>
      <div style={{fontSize:11,color:G.dim,textAlign:"center",marginBottom:20}}>
        The Word document is fully editable — open in Microsoft Word, Google Docs, or Pages to customize before sending.
      </div>

      {/* Preview */}
      <div id="printable" style={{background:"#fff",color:"#111",borderRadius:8,padding:"44px 52px",maxWidth:760,margin:"0 auto",fontFamily:"Georgia,serif"}}>
        <div style={{borderBottom:"3px solid #0e1117",paddingBottom:22,marginBottom:28}}>
          <div style={{fontSize:30,fontWeight:700}}>BID PROPOSAL</div>
          <div style={{fontSize:12,color:"#666",marginTop:4}}>Earthwork &middot; Demolition &middot; Underground Utilities</div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,marginBottom:32,fontSize:13}}>
          <div>
            <div style={{fontWeight:700,fontSize:9,letterSpacing:2,color:"#999",textTransform:"uppercase",marginBottom:7}}>Submitted To</div>
            <div style={{fontWeight:700,fontSize:15}}>{proj.client||"Client Name"}</div>
            <div style={{color:"#666",marginTop:3}}>{proj.address||""}</div>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:9,letterSpacing:2,color:"#999",textTransform:"uppercase",marginBottom:7}}>Project Details</div>
            <div><b>Project:</b> {proj.name||"—"}</div>
            <div><b>Type:</b> {(proj.type||"").charAt(0).toUpperCase()+(proj.type||"").slice(1)}</div>
            <div><b>Date:</b> {proj.date}</div>
          </div>
        </div>

        {TRADES.map(trade=>{
          const its=(proj.lineItems||[]).filter(l=>l.trade===trade);
          if(!its.length) return null;
          const tt=its.reduce((s,i)=>s+lnTot(i),0);
          return (
            <div key={trade} style={{marginBottom:26}}>
              <div style={{display:"flex",justifyContent:"space-between",background:"#0e1117",color:"#fff",padding:"7px 14px",fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:1.5}}>
                <span>{trade}</span><span>{fmt(tt)}</span>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{background:"#f5f5f5"}}>
                    {["Description","Qty","Unit","Unit Price","Total"].map(h=>(
                      <th key={h} style={{...thS,textAlign:h==="Total"||h==="Unit Price"?"right":"left"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {its.map((i,idx)=>(
                    <tr key={i.id} style={{background:idx%2?"#fafafa":"#fff"}}>
                      <td style={{padding:"6px 10px"}}>{i.name}</td>
                      <td style={{padding:"6px 10px",textAlign:"center"}}>{i.qty}</td>
                      <td style={{padding:"6px 10px",textAlign:"center"}}>{i.unit}</td>
                      <td style={{padding:"6px 10px",textAlign:"right"}}>{fmt(n2l(i.material)+n2l(i.labor)+n2l(i.equipment))}</td>
                      <td style={{padding:"6px 10px",textAlign:"right",fontWeight:600}}>{fmt(lnTot(i))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        {(proj.equipmentItems||[]).length>0&&(
          <div style={{marginBottom:26}}>
            <div style={{display:"flex",justifyContent:"space-between",background:"#2d1f4a",color:"#fff",padding:"7px 14px",fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:1.5}}>
              <span>Equipment</span><span>{fmt(eq)}</span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:"#f5f5f5"}}>{["Equipment","Duration","Rate","Mob","Total"].map(h=><th key={h} style={thS}>{h}</th>)}</tr></thead>
              <tbody>
                {proj.equipmentItems.map((i,idx)=>(
                  <tr key={i.id} style={{background:idx%2?"#fafafa":"#fff"}}>
                    <td style={{padding:"6px 10px"}}>{i.name}</td>
                    <td style={{padding:"6px 10px"}}>{i.rentalType==="day"?i.days+" days":i.weeks+" weeks"}</td>
                    <td style={{padding:"6px 10px"}}>{fmt(i.rentalType==="day"?i.dayRate:i.weekRate)}/{i.rentalType}</td>
                    <td style={{padding:"6px 10px"}}>{fmt(i.mobilization)}</td>
                    <td style={{padding:"6px 10px",fontWeight:600}}>{fmt(eqTot(i))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(proj.crewItems||[]).length>0&&(
          <div style={{marginBottom:26}}>
            <div style={{display:"flex",justifyContent:"space-between",background:"#1a3a2a",color:"#fff",padding:"7px 14px",fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:1.5}}>
              <span>Crew Labor</span><span>{fmt(cr)}</span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:"#f5f5f5"}}>{["Role","Workers","Hrs/Day","Days","Rate/hr","Total"].map(h=><th key={h} style={thS}>{h}</th>)}</tr></thead>
              <tbody>
                {proj.crewItems.map((i,idx)=>(
                  <tr key={i.id} style={{background:idx%2?"#fafafa":"#fff"}}>
                    <td style={{padding:"6px 10px"}}>{i.name}</td>
                    <td style={{padding:"6px 10px"}}>{i.workers||1}</td>
                    <td style={{padding:"6px 10px"}}>{i.hours}</td>
                    <td style={{padding:"6px 10px"}}>{i.days}</td>
                    <td style={{padding:"6px 10px"}}>${i.hourlyRate}/hr</td>
                    <td style={{padding:"6px 10px",fontWeight:600}}>{fmt(crTot(i))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{borderTop:"2px solid #0e1117",paddingTop:18,display:"flex",justifyContent:"flex-end"}}>
          <div style={{width:300,fontSize:13}}>
            {[
              ["Subtotal",fmt(sub)],
              ["Markup ("+proj.markup+"%)",fmt(mu)],
              ["Tax ("+proj.tax+"%)",fmt(tx)]
            ].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}>
                <span>{l}</span><span>{v}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:17,marginTop:8,paddingTop:10,borderTop:"1px solid #ddd"}}>
              <span>TOTAL BID</span><span>{fmt(total)}</span>
            </div>
          </div>
        </div>

        {proj.notes&&(
          <div style={{marginTop:24,padding:14,background:"#f9f9f9",borderLeft:"3px solid #0e1117",fontSize:12,color:"#555"}}>
            <b>Notes:</b> {proj.notes}
          </div>
        )}

        <div style={{marginTop:32,borderTop:"1px solid #e0e0e0",paddingTop:14,fontSize:10,color:"#aaa",display:"flex",justifyContent:"space-between"}}>
          <span>Proposal valid 30 days.</span>
          <span>Authorized: ___________________</span>
        </div>
      </div>
    </div>
  );
}

// ---- Project Editor ----
function ProjectEditor({project,onSave,onBack,onDelete,library,setLibrary,equipCatalog,setEquipCatalog,crewCatalog,setCrewCatalog}) {
  const [proj,setProj] = useState({equipmentItems:[],crewItems:[],...project});
  const [tab,setTab]   = useState("ai");
  const set    = (f,v) => setProj(p=>({...p,[f]:v}));
  const addArr = (arr) => setProj(p=>({...p,lineItems:[...(p.lineItems||[]),...arr]}));
  const addOne = (item,trade) => setProj(p=>({...p,lineItems:[...(p.lineItems||[]),{...item,id:uid(),trade,qty:0}]}));
  const updLI  = (id,f,v) => setProj(p=>({...p,lineItems:(p.lineItems||[]).map(l=>l.id===id?{...l,[f]:["qty","material","labor","equipment"].includes(f)?n2(v):v}:l)}));
  const remLI  = (id) => setProj(p=>({...p,lineItems:(p.lineItems||[]).filter(l=>l.id!==id)}));
  const T = tots(proj);
  const TABS = [{id:"ai",label:"AI Estimator"},{id:"takeoff",label:"Takeoff"},{id:"library",label:"Library"},{id:"equipment",label:"Equipment"},{id:"crew",label:"Crew"},{id:"summary",label:"Summary"},{id:"proposal",label:"Proposal"}];

  return (
    <div>
      <style>{`@media print{body>*{display:none!important}#printable{display:block!important}}`}</style>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
        <button onClick={onBack} style={base.ghost}>Back</button>
        <input value={proj.name} onChange={e=>set("name",e.target.value)} placeholder="Project Name" style={{...base.input,flex:1,fontSize:18,fontWeight:700,background:"transparent",border:"none",borderBottom:"1px solid #1e2740",borderRadius:0,padding:"4px 0"}}/>
        <button onClick={()=>onDelete(proj.id)} style={base.danger}>Delete</button>
        
        <button onClick={()=>onSave(proj)} style={base.primary}>Save</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:12,marginBottom:22}}>
        {[{l:"Type",f:"type",t:"select",o:["residential","commercial"]},{l:"Client",f:"client",t:"text"},{l:"Address",f:"address",t:"text"},{l:"Date",f:"date",t:"date"},{l:"Markup %",f:"markup",t:"number"},{l:"Tax %",f:"tax",t:"number"}].map(r=>(
          <div key={r.f}>
            <label style={base.label}>{r.l}</label>
            {r.t==="select"
              ?<select value={proj[r.f]} onChange={e=>set(r.f,e.target.value)} style={base.input}>{r.o.map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}</select>
              :<input type={r.t} value={proj[r.f]} onChange={e=>set(r.f,r.t==="number"?n2(e.target.value):e.target.value)} style={base.input}/>
            }
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        <Stat label="Takeoff" value={fmt(T.li)}/><Stat label="Equipment" value={fmt(T.eq)}/><Stat label="Crew" value={fmt(T.cr)}/><Stat label="Total Bid" value={fmt(T.total)} gold/>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid #1e2740",overflowX:"auto"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={tabSty(tab===t.id)}>{t.label}</button>)}
      </div>
      <div style={{paddingTop:22}}>
        {tab==="ai"        &&<JobIntelligence/>}
        {tab==="takeoff"   &&<TakeoffTab proj={proj} updateItem={updLI} removeItem={remLI} addCustom={item=>setProj(p=>({...p,lineItems:[...(p.lineItems||[]),item]}))} totals={T}/>}
        {tab==="library"   &&<LibraryTab library={library} setLibrary={setLibrary} proj={proj} addItem={addOne}/>}
        {tab==="equipment" &&<EquipmentTab items={proj.equipmentItems||[]} onChange={v=>set("equipmentItems",v)} catalog={equipCatalog} setCatalog={setEquipCatalog}/>}
        {tab==="crew"      &&<CrewTab items={proj.crewItems||[]} onChange={v=>set("crewItems",v)} catalog={crewCatalog} setCatalog={setCrewCatalog}/>}
        {tab==="summary"   &&(
          <div>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:24}}>
              <Stat label="Takeoff" value={fmt(T.li)}/><Stat label="Equipment" value={fmt(T.eq)}/><Stat label="Crew" value={fmt(T.cr)}/><Stat label={"Markup "+proj.markup+"%"} value={fmt(T.mu)}/><Stat label={"Tax "+proj.tax+"%"} value={fmt(T.tx)}/><Stat label="Total Bid" value={fmt(T.total)} gold/>
            </div>
            {TRADES.map(trade=>{
              const its=(proj.lineItems||[]).filter(l=>l.trade===trade);
              if(!its.length) return null;
              return (
                <div key={trade} style={{marginBottom:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}><Badge label={trade} color={trade}/><span style={{color:G.muted,fontSize:12}}>{its.length} items</span></div>
                    <span style={{color:G.gold,fontFamily:"'DM Mono',monospace"}}>{fmt(its.reduce((s,i)=>s+lnTot(i),0))}</span>
                  </div>
                  <div style={base.card}>
                    {its.map((i,idx)=><div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:idx<its.length-1?"1px solid #0e1117":"none"}}><span style={{color:"#6b7a99",fontSize:13}}>{i.name} x{i.qty} {i.unit}</span><span style={{color:"#ccd3e0",fontFamily:"'DM Mono',monospace",fontSize:13}}>{fmt(lnTot(i))}</span></div>)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {tab==="proposal" &&<ProposalView proj={proj}/>}
      </div>
    </div>
  );
}

// ---- Dashboard ----
function Dashboard({projects,onNew,onOpen,onCompare}) {
  const pipeline = projects.reduce((s,p)=>s+tots(p).total,0);
  const avg      = projects.length?pipeline/projects.length:0;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28}}>
        <div><h2 style={{margin:0,fontSize:24,color:G.text}}>Projects</h2><p style={{margin:"4px 0 0",color:G.muted,fontSize:13}}>Earthwork · Demolition · Underground Utilities</p></div>
        <div style={{display:"flex",gap:10}}>
          {projects.length>=2&&<button onClick={onCompare} style={base.ghost}>Compare</button>}
          <button onClick={onNew} style={base.primary}>+ New Estimate</button>
        </div>
      </div>
      <div style={{display:"flex",gap:14,marginBottom:30,flexWrap:"wrap"}}>
        <Stat label="Projects" value={String(projects.length)}/><Stat label="Pipeline" value={fmt(pipeline)} gold/><Stat label="Avg Bid" value={fmt(avg)}/>
      </div>
      {projects.length===0
        ?<div style={{textAlign:"center",padding:80,color:G.dim}}><div style={{fontSize:48,marginBottom:14}}>🏗️</div><div style={{fontSize:15,color:G.muted}}>No estimates yet.</div></div>
        :<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {projects.map(p=>{
            const t=tots(p);
            const trades=[...new Set((p.lineItems||[]).map(l=>l.trade))];
            return (
              <div key={p.id} onClick={()=>onOpen(p.id)} style={{...base.card,display:"flex",alignItems:"center",cursor:"pointer",gap:16}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5}}>
                    <span style={{color:G.text,fontWeight:600,fontSize:15}}>{p.name||"Untitled"}</span>
                    <span style={{background:p.type==="residential"?"#1e3a5f22":"#2d1f4a22",color:p.type==="residential"?"#5b9bd5":"#9b7dd4",fontSize:10,padding:"2px 8px",borderRadius:12,fontWeight:600}}>{p.type}</span>
                  </div>
                  <div style={{color:G.muted,fontSize:12,marginBottom:8}}>{p.address||"No address"} · {p.client||"No client"} · {p.date}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {trades.map(tr=><Badge key={tr} label={tr} color={tr}/>)}
                    {t.eq>0&&<Badge label="equipment" color="equipment"/>}
                    {t.cr>0&&<Badge label="crew" color="crew"/>}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:G.gold,fontSize:18,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{fmt(t.total)}</div>
                  <div style={{color:G.dim,fontSize:11,marginTop:2}}>{(p.lineItems||[]).length} items</div>
                </div>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
}

// ---- Comparison ----
function ComparisonView({projects}) {
  if(projects.length<2) return <div style={{textAlign:"center",padding:60,color:G.dim}}><div style={{fontSize:36,marginBottom:12}}>📊</div><div>Add at least 2 projects to compare.</div></div>;
  const data = projects.map(p=>({...p,...tots(p)}));
  const maxT = Math.max(...data.map(d=>d.total));
  return (
    <div>
      <div style={{display:"flex",gap:14,marginBottom:28,flexWrap:"wrap"}}>
        <Stat label="Projects" value={String(data.length)}/><Stat label="Pipeline" value={fmt(data.reduce((s,d)=>s+d.total,0))} gold/><Stat label="Avg" value={fmt(data.reduce((s,d)=>s+d.total,0)/data.length)}/>
      </div>
      <div style={{...base.card,marginBottom:20}}>
        {data.map((p,i)=>(
          <div key={p.id} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:"#ccd3e0",fontSize:13}}>{p.name||"Untitled"}</span><span style={{color:G.gold,fontFamily:"'DM Mono',monospace",fontSize:13}}>{fmt(p.total)}</span></div>
            <div style={{background:G.bg,borderRadius:4,height:20,overflow:"hidden"}}><div style={{height:"100%",width:(p.total/maxT*100)+"%",background:"hsl("+(200+i*30)+",60%,50%)",borderRadius:4,minWidth:4}}/></div>
          </div>
        ))}
      </div>
      <div style={base.card}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr>{["Project","Type","Earthwork","Demo","Utilities","Equipment","Crew","Total"].map(h=><th key={h} style={base.th}>{h}</th>)}</tr></thead>
            <tbody>
              {data.map(p=>(
                <tr key={p.id}>
                  <td style={{...base.td,color:"#ccd3e0",fontWeight:600}}>{p.name||"Untitled"}</td>
                  <td style={base.td}><span style={{background:p.type==="residential"?"#1e3a5f22":"#2d1f4a22",color:p.type==="residential"?"#5b9bd5":"#9b7dd4",fontSize:10,padding:"2px 7px",borderRadius:12,fontWeight:600}}>{p.type}</span></td>
                  {["earthwork","demolition","utilities"].map(tr=><td key={tr} style={{...base.td,fontFamily:"'DM Mono',monospace",fontSize:12}}>{fmt((p.lineItems||[]).filter(l=>l.trade===tr).reduce((s,i)=>s+lnTot(i),0))}</td>)}
                  <td style={{...base.td,fontFamily:"'DM Mono',monospace",fontSize:12}}>{fmt(p.eq)}</td>
                  <td style={{...base.td,fontFamily:"'DM Mono',monospace",fontSize:12}}>{fmt(p.cr)}</td>
                  <td style={{...base.td,fontFamily:"'DM Mono',monospace",color:G.gold,fontWeight:700}}>{fmt(p.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---- Demo ----
const DEMO = {
  id:"demo1",name:"Riverside Commercial Pad",type:"commercial",client:"Harmon Development LLC",
  address:"4501 Riverside Dr",date:"2026-05-15",notes:"Site must remain accessible.",markup:18,tax:8.5,
  lineItems:[
    {id:"dl1",name:"Excavation - General",unit:"CY",material:0,labor:12.5,equipment:8,trade:"earthwork",qty:420},
    {id:"dl2",name:"Backfill - Compacted",unit:"CY",material:4.5,labor:9,equipment:5.5,trade:"earthwork",qty:180},
    {id:"dl3",name:"Asphalt Removal",unit:"SY",material:0,labor:3.5,equipment:4.5,trade:"demolition",qty:850},
    {id:"dl4",name:"Sewer Main 8in",unit:"LF",material:35,labor:28,equipment:15,trade:"utilities",qty:320},
    {id:"dl5",name:"Manhole 48in",unit:"EA",material:2200,labor:800,equipment:400,trade:"utilities",qty:3},
  ],
  equipmentItems:[
    {id:"de1",name:"Excavator 20-ton",type:"Heavy Excavation",dayRate:1800,weekRate:7500,mobilization:850,rentalType:"week",days:0,weeks:3},
    {id:"de2",name:"Bulldozer D6",type:"Earthwork",dayRate:1600,weekRate:6500,mobilization:950,rentalType:"week",days:0,weeks:2},
  ],
  crewItems:[
    {id:"dc1",name:"Superintendent",hourlyRate:95,defaultHours:8,hours:8,days:21,workers:1},
    {id:"dc2",name:"Heavy Equipment Operator",hourlyRate:68,defaultHours:8,hours:8,days:21,workers:2},
    {id:"dc3",name:"Laborer General",hourlyRate:42,defaultHours:8,hours:8,days:21,workers:4},
  ],
};

// ---- App ----
export default function App() {
  const [projects,setProjects]         = useState([DEMO]);
  const [view,setView]                 = useState("dashboard");
  const [activeId,setActiveId]         = useState(null);
  const [library,setLibrary]           = useState(INIT_LIBRARY);
  const [equipCatalog,setEquipCatalog] = useState(INIT_EQUIP);
  const [crewCatalog,setCrewCatalog]   = useState(INIT_CREW);

  const open  = (id) => { setActiveId(id); setView("editor"); };
  const newP  = ()   => { const p={...{name:"",type:"residential",address:"",client:"",date:new Date().toISOString().slice(0,10),notes:"",markup:15,tax:8.5,lineItems:[],equipmentItems:[],crewItems:[]},id:uid()}; setProjects(ps=>[...ps,p]); open(p.id); };
  const save  = (u)  => { setProjects(ps=>ps.map(p=>p.id===u.id?u:p)); setView("dashboard"); };
  const del   = (id) => { setProjects(ps=>ps.filter(p=>p.id!==id)); setView("dashboard"); };
  const active = projects.find(p=>p.id===activeId);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:G.bg,fontFamily:"'Barlow',sans-serif",color:G.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Barlow:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#080b10}::-webkit-scrollbar-thumb{background:#1e2740;border-radius:3px}input[type=number]::-webkit-inner-spin-button{opacity:0.3}@media print{body>*{display:none!important}#printable{display:block!important}}@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>

      <div style={{width:200,background:G.sidebar,borderRight:"1px solid #1c2234",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"26px 18px 18px"}}>
          <div style={{fontSize:11,letterSpacing:3.5,color:G.gold,fontWeight:800,marginBottom:3}}>FIELDEST</div>
          <div style={{fontSize:9,color:"#1e2740",letterSpacing:1.5,textTransform:"uppercase"}}>Estimating Platform</div>
        </div>
        <div style={{padding:"0 10px"}}>
          {[{id:"dashboard",icon:"▦",label:"Projects"},{id:"compare",icon:"⊞",label:"Compare"}].map(n=>(
            <button key={n.id} onClick={()=>setView(n.id)} style={navSty(view===n.id||(n.id==="dashboard"&&view==="editor"))}>
              <span style={{fontSize:14}}>{n.icon}</span>{n.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 24px"}}>
          {view==="dashboard"&&<Dashboard projects={projects} onNew={newP} onOpen={open} onCompare={()=>setView("compare")}/>}
          {view==="editor"&&active&&<ProjectEditor key={active.id} project={active} onSave={save} onBack={()=>setView("dashboard")} onDelete={del} library={library} setLibrary={setLibrary} equipCatalog={equipCatalog} setEquipCatalog={setEquipCatalog} crewCatalog={crewCatalog} setCrewCatalog={setCrewCatalog}/>}
          {view==="compare"&&<div><div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}><button onClick={()=>setView("dashboard")} style={base.ghost}>Back</button><h2 style={{margin:0,color:G.text,fontSize:22}}>Project Comparison</h2></div><ComparisonView projects={projects}/></div>}
        </div>
      </div>
    </div>
  );
}
