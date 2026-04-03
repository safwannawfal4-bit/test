import React, { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const products = [
  {
    id: 'core',
    name: 'InfluxDB 3 Core',
    tag: 'Free & Open Source',
    tagColor: 'text-neon-400 border-neon-400/30',
    desc: 'The open-source foundation for time series. Self-host with zero cost and full control.',
    features: ['Columnar storage via Apache Arrow', 'Native SQL & InfluxQL', 'Parquet file persistence', 'Community-driven & extensible'],
    code: `# Install and start\ncurl -O https://dl.influxdata.com/influxdb3\nchmod +x influxdb3 && ./influxdb3 serve\n\n# Write with line protocol\ncurl -X POST 'http://localhost:8181/api/v3/write' \\\n  -d 'cpu,host=server01 usage=72.5'`,
  },
  {
    id: 'enterprise',
    name: 'InfluxDB 3 Enterprise',
    tag: 'Commercial',
    tagColor: 'text-amber-400 border-amber-400/30',
    desc: 'Production-grade time series with clustering, RBAC, and enterprise support.',
    features: ['Horizontal read scaling', 'Role-based access control', 'Compaction & tiered storage', 'Enterprise SLAs & support'],
    code: `-- Enterprise SQL query\nSELECT region, mean(latency_ms)\nFROM api_requests\nWHERE time > now() - INTERVAL '24h'\nGROUP BY region\nORDER BY mean DESC\nLIMIT 10;`,
  },
  {
    id: 'serverless',
    name: 'Cloud Serverless',
    tag: 'Pay-per-use',
    tagColor: 'text-cyan-400 border-cyan-400/30',
    desc: 'Fully managed, auto-scaling time series. No infrastructure to provision.',
    features: ['Instant provisioning', 'Pay only for what you use', 'Auto-scaling ingestion', 'Built-in dashboards'],
    code: `import { InfluxDBClient } from\n  '@influxdata/influxdb3-client';\n\nconst client = new InfluxDBClient({\n  host: 'https://us-east-1.aws.cloud2.influxdata.com',\n  token: process.env.INFLUX_TOKEN,\n  database: 'sensors'\n});`,
  },
  {
    id: 'dedicated',
    name: 'Cloud Dedicated',
    tag: 'Single-tenant',
    tagColor: 'text-purple-400 border-purple-400/30',
    desc: 'Managed single-tenant cluster for workloads demanding isolation and performance.',
    features: ['Dedicated compute & storage', 'Custom retention policies', 'VPC peering support', 'Guaranteed performance SLAs'],
    code: `# Python client — write sensor data\nimport influxdb_client_3 as ix\n\nclient = ix.InfluxDBClient3(\n    host="dedicated-cluster.influxdata.io",\n    token=TOKEN, org="acme"\n)\nclient.write("sensors", [\n    ix.Point("temp").field("value", 22.5)\n])`,
  },
];

export default function Products() {
  const [active, setActive] = useState('core');
  const [ref, visible] = useScrollReveal();
  const product = products.find((p) => p.id === active);

  return (
    <section id="products" className="relative py-28 grid-bg" ref={ref}>
      <div className={`max-w-7xl mx-auto px-6 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-3">Products</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Choose your deployment</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {products.map((p) => (
            <button key={p.id} onClick={() => setActive(p.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                active === p.id
                  ? 'glass glow-border-cyan text-white'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent'
              }`}>
              {p.name.replace('InfluxDB 3 ', '').replace('Cloud ', '')}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div className="glass rounded-2xl p-8 lg:p-10 glow-border-cyan transition-all duration-500">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left: info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                <span className={`text-xs font-medium border px-2.5 py-0.5 rounded-full ${product.tagColor}`}>
                  {product.tag}
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">{product.desc}</p>
              <ul className="space-y-3 mb-8">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <svg className="w-5 h-5 text-neon-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#get-started" className="text-cyan-400 text-sm font-medium hover:underline inline-flex items-center gap-1">
                Learn more <span>&rarr;</span>
              </a>
            </div>

            {/* Right: code */}
            <div className="code-block p-5 overflow-auto text-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-amber-400/70" />
                <span className="w-3 h-3 rounded-full bg-neon-400/70" />
                <span className="ml-3 text-xs text-gray-600">{product.id}.sql</span>
              </div>
              <pre className="text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                {product.code.split('\n').map((line, i) => {
                  if (line.startsWith('#') || line.startsWith('--')) {
                    return <div key={i}><span className="syn-comment">{line}</span></div>;
                  }
                  return (
                    <div key={i}>
                      {line
                        .replace(/(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|INSERT INTO|VALUES|CREATE|import|const|new|export)/g, '§KW§$1§/KW§')
                        .replace(/(mean|max|now|Point|write|InfluxDBClient3|InfluxDBClient)/g, '§FN§$1§/FN§')
                        .replace(/('(?:[^'\\]|\\.)*')/g, '§ST§$1§/ST§')
                        .replace(/("(?:[^"\\]|\\.)*")/g, '§ST§$1§/ST§')
                        .replace(/(\b\d+\.?\d*\b)/g, '§NM§$1§/NM§')
                        .split(/§(KW|FN|ST|NM|\/KW|\/FN|\/ST|\/NM)§/)
                        .reduce((acc, part, idx, arr) => {
                          if (part === 'KW') { acc.push(<span key={idx} className="syn-keyword">{arr[idx + 1]}</span>); }
                          else if (part === 'FN') { acc.push(<span key={idx} className="syn-function">{arr[idx + 1]}</span>); }
                          else if (part === 'ST') { acc.push(<span key={idx} className="syn-string">{arr[idx + 1]}</span>); }
                          else if (part === 'NM') { acc.push(<span key={idx} className="syn-number">{arr[idx + 1]}</span>); }
                          else if (!['KW', 'FN', 'ST', 'NM', '/KW', '/FN', '/ST', '/NM'].includes(part) &&
                            !['KW', 'FN', 'ST', 'NM'].includes(arr[idx - 1])) {
                            acc.push(<span key={idx}>{part}</span>);
                          }
                          return acc;
                        }, [])
                      }
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
