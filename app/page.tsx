const publicWork = [
  {
    year: "2023",
    label: "Capacity orchestration",
    title: "Global Capacity Management with Flux",
    description:
      "Flux jointly plans service placement, traffic distribution, and regional capacity across Meta’s private cloud. The OSDI paper acknowledges Kiryong as a member of the Flux team in 2023.",
    proof: "1,000s of services · 10s of regions · millions of servers",
    href: "https://www.usenix.org/conference/osdi23/presentation/eriksen",
    linkLabel: "OSDI ’23 paper",
  },
  {
    year: "2022",
    label: "Capacity measurement",
    title: "Live Traffic Load Testing at Facebook Scale",
    description:
      "A production load-testing approach for measuring maximum safe service throughput while workloads, software, hardware, and service dependencies keep changing.",
    proof: "Speaker with Lin Xiao · Systems @Scale",
    href: "https://atscaleconference.com/videos/live-traffic-load-testing-measuring-and-validating-capacity-at-facebook/",
    linkLabel: "Watch the talk",
  },
  {
    year: "2020",
    label: "Dynamic capacity",
    title: "Throughput Autoscaling for Facebook.com",
    description:
      "Workload-driven sizing combines demand prediction, disaster modeling, live-traffic supply measurement, and safety controls to release off-peak capacity for other workloads, including machine learning.",
    proof: "Co-author · Engineering at Meta",
    href: "https://engineering.fb.com/2020/09/14/networking-traffic/throughput-autoscaling/",
    linkLabel: "Read the engineering article",
  },
  {
    year: "2019",
    label: "Global traffic",
    title: "Taiji: Managing Global User Traffic",
    description:
      "A constraint-optimization system that balances data-center utilization and network latency while adapting global traffic routing to demand and failure events.",
    proof: "Co-author · SOSP ’19 · 17% lower backend query load",
    href: "https://doi.org/10.1145/3341301.3359655",
    linkLabel: "Read the paper",
  },
];

const career = [
  {
    period: "Current",
    place: "Meta",
    role: "Principal Engineer (E8)",
    detail:
      "Private-cloud capacity management and capacity fulfillment for product and AI infrastructure.",
  },
  {
    period: "2011 — 2016",
    place: "Carnegie Mellon University",
    role: "Ph.D., Electrical & Computer Engineering",
    detail:
      "Designed systems infrastructure for mobile–cloud convergence under Mahadev Satyanarayanan.",
    href: "https://kilthub.cmu.edu/articles/thesis/System_Infrastructure_for_Mobile-Cloud_Convergence/6723461",
  },
  {
    period: "Summer 2014",
    place: "Microsoft Research",
    role: "Research intern, Edge Computing",
    detail:
      "GPU-state migration between edge and data-center systems by reproducing OpenGL state.",
    href: "https://www.microsoft.com/en-us/research/project/edge-computing/people/",
  },
  {
    period: "2007 — 2011",
    place: "ETRI",
    role: "Research staff",
    detail:
      "Virtualization, on-demand computing, and context-aware healthcare systems.",
  },
  {
    period: "2000 — 2007",
    place: "KAIST",
    role: "B.S., EECS · M.S., BioSystems",
    detail: "Foundation in computing systems, signals, and applied research.",
  },
];

const publications = [
  {
    year: "2019",
    venue: "SOSP",
    title:
      "Taiji: Managing Global User Traffic for Large-Scale Internet Services at the Edge",
    role: "Co-author",
    href: "https://doi.org/10.1145/3341301.3359655",
  },
  {
    year: "2017",
    venue: "SEC",
    title: "You Can Teach Elephants to Dance: Agile VM Handoff for Edge Computing",
    role: "Lead author",
    href: "https://doi.org/10.1145/3132211.3134453",
  },
  {
    year: "2016",
    venue: "Ph.D. thesis",
    title: "System Infrastructure for Mobile-Cloud Convergence",
    role: "Author",
    href: "https://kilthub.cmu.edu/articles/thesis/System_Infrastructure_for_Mobile-Cloud_Convergence/6723461",
  },
  {
    year: "2014",
    venue: "MobiSys",
    title: "Towards Wearable Cognitive Assistance",
    role: "Lead author",
    href: "https://doi.org/10.1145/2594368.2594383",
  },
  {
    year: "2013",
    venue: "MobiSys",
    title: "Just-in-Time Provisioning for Cyber Foraging",
    role: "Lead author",
    href: "https://doi.org/10.1145/2462456.2464451",
  },
  {
    year: "2013",
    venue: "IC2E",
    title: "The Impact of Mobile Multimedia Applications on Data Center Consolidation",
    role: "Lead author",
    href: "https://doi.org/10.1109/IC2E.2013.36",
  },
];

const patents = [
  {
    number: "US 10,931,743",
    year: "2021",
    title:
      "Dynamically generating routing tables for edge nodes in large-scale networking infrastructures",
    context: "Facebook · Inventor",
    href: "https://patents.justia.com/patent/10931743",
  },
  {
    number: "US 9,965,823",
    year: "2018",
    title: "Migration of graphics processing unit (GPU) states",
    context: "Microsoft · Inventor",
    href: "https://patents.google.com/patent/US9965823B2/en",
  },
  {
    number: "US 2011/0173319",
    year: "2011",
    title: "Apparatus and method for operating a server using virtualization technique",
    context: "ETRI · Patent application · Inventor",
    href: "https://patents.google.com/patent/US20110173319A1/en",
  },
];

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://krha.kr/#kiryong-ha",
  name: "Kiryong Ha",
  alternateName: "하기룡",
  url: "https://krha.kr/",
  jobTitle: "Principal Engineer",
  honorificSuffix: "Ph.D.",
  description:
    "Principal Engineer at Meta specializing in hyperscale private-cloud capacity management, capacity fulfillment, AI infrastructure, distributed systems, and edge computing.",
  worksFor: {
    "@type": "Organization",
    name: "Meta",
    url: "https://www.meta.com/",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Carnegie Mellon University",
      url: "https://www.cmu.edu/",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "KAIST",
      url: "https://www.kaist.ac.kr/en/",
    },
  ],
  knowsAbout: [
    "Hyperscale private cloud",
    "Capacity management",
    "Capacity fulfillment",
    "AI infrastructure",
    "Distributed systems",
    "Traffic engineering",
    "Autoscaling",
    "Live traffic load testing",
    "Edge computing",
    "Cloudlets",
  ],
  sameAs: [
    "https://www.linkedin.com/in/kiryong-ha",
    "https://github.com/krha",
    "https://dblp.org/pid/01/4626",
  ],
};

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Kiryong Ha, home">
          KH<span>.</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#focus">Focus</a>
          <a href="#work">Work</a>
          <a href="#career">Career</a>
          <a href="#publications">Writing</a>
        </nav>
        <ExternalLink
          className="header-link"
          href="https://www.linkedin.com/in/kiryong-ha"
        >
          LinkedIn
        </ExternalLink>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Kiryong Ha · 하기룡</p>
            <h1 id="hero-title">
              Engineering capacity
              <br />
              <em>at hyperscale.</em>
            </h1>
            <p className="hero-lede">
              Principal Engineer (E8) at Meta, specializing in private-cloud
              capacity management, capacity fulfillment, and the infrastructure
              that powers product and AI workloads.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                Explore public work <span aria-hidden="true">↓</span>
              </a>
              <ExternalLink
                className="button button-secondary"
                href="https://dblp.org/pid/01/4626"
              >
                Complete bibliography
              </ExternalLink>
            </div>
          </div>

          <div className="capacity-map" aria-label="Capacity fulfillment loop">
            <div className="map-header">
              <span>THE CAPACITY LOOP</span>
              <span className="live-dot">CONTINUOUS</span>
            </div>
            <div className="map-stage">
              <span className="map-index">01</span>
              <div>
                <strong>Understand demand</strong>
                <p>Product growth · AI training · inference · failure scenarios</p>
              </div>
            </div>
            <div className="map-connector" aria-hidden="true">
              <span>MODEL</span>
            </div>
            <div className="map-stage map-stage-accent">
              <span className="map-index">02</span>
              <div>
                <strong>Match supply</strong>
                <p>Regions · hardware · service constraints · traffic</p>
              </div>
            </div>
            <div className="map-connector" aria-hidden="true">
              <span>ORCHESTRATE</span>
            </div>
            <div className="map-stage">
              <span className="map-index">03</span>
              <div>
                <strong>Fulfill safely</strong>
                <p>Place · validate · rebalance · recover · improve utilization</p>
              </div>
            </div>
            <div className="map-outcome">
              <span>Reliability</span>
              <span>Efficiency</span>
              <span>Velocity</span>
            </div>
          </div>
        </section>

        <section className="scale-band" aria-label="Publicly documented system scale">
          <div>
            <strong>Millions</strong>
            <span>of servers</span>
          </div>
          <div>
            <strong>1,000s</strong>
            <span>of services</span>
          </div>
          <div>
            <strong>10s</strong>
            <span>of regions</span>
          </div>
          <div>
            <strong>15+</strong>
            <span>years in systems</span>
          </div>
          <p>
            Scale figures describe the publicly documented Flux system; they are
            not a measure of individual ownership. <ExternalLink href="https://www.usenix.org/conference/osdi23/presentation/eriksen">Source</ExternalLink>
          </p>
        </section>

        <section className="section focus" id="focus" aria-labelledby="focus-title">
          <div className="section-heading">
            <p className="section-number">01 / CURRENT FOCUS</p>
            <h2 id="focus-title">Turning finite compute into dependable capacity.</h2>
          </div>
          <div className="focus-content">
            <p className="focus-intro">
              At Meta, I work on the operating layer that turns constrained
              data-center supply into reliable compute for products and AI
              systems—connecting demand, service performance, hardware, regional
              availability, and safe execution.
            </p>
            <div className="focus-grid">
              <article>
                <span>01</span>
                <h3>Capacity fulfillment</h3>
                <p>
                  Translate demand and infrastructure constraints into capacity
                  that workloads can actually use, in the right place and at the
                  right time.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>AI infrastructure</h3>
                <p>
                  Help align scarce, heterogeneous compute with fast-growing AI
                  training and inference needs while protecting reliability and
                  utilization.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Closed-loop systems</h3>
                <p>
                  Measure real capacity, model demand and failures, orchestrate
                  changes, validate outcomes, and feed what happened back into the
                  next decision.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading light-heading">
            <p className="section-number">02 / SELECTED PUBLIC WORK</p>
            <h2 id="work-title">Systems that connect traffic, capacity, and compute.</h2>
            <p>
              Public artifacts show a consistent arc: understand real workload,
              make capacity measurable, and safely automate decisions at global
              scale.
            </p>
          </div>
          <div className="work-list">
            {publicWork.map((item) => (
              <article className="work-card" key={item.title}>
                <div className="work-meta">
                  <span>{item.year}</span>
                  <span>{item.label}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="work-proof">{item.proof}</div>
                <ExternalLink href={item.href}>{item.linkLabel}</ExternalLink>
              </article>
            ))}
          </div>
        </section>

        <section className="section career-section" id="career" aria-labelledby="career-title">
          <div className="section-heading">
            <p className="section-number">03 / CAREER</p>
            <h2 id="career-title">From the edge of the cloud to its global control plane.</h2>
          </div>
          <div className="timeline">
            {career.map((item) => (
              <article className="timeline-item" key={`${item.place}-${item.period}`}>
                <time>{item.period}</time>
                <div>
                  <h3>{item.place}</h3>
                  <p className="timeline-role">{item.role}</p>
                  <p>{item.detail}</p>
                  {item.href ? (
                    <ExternalLink href={item.href}>Public source</ExternalLink>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section writing-section" id="publications" aria-labelledby="writing-title">
          <div className="section-heading light-heading">
            <p className="section-number">04 / PUBLICATIONS & PATENTS</p>
            <h2 id="writing-title">Selected technical record.</h2>
            <p>
              Research and engineering across traffic management, capacity,
              virtualization, mobile–cloud convergence, and edge computing.
            </p>
          </div>

          <div className="record-grid">
            <div>
              <div className="record-title-row">
                <h3>Publications</h3>
                <ExternalLink href="https://dblp.org/pid/01/4626">
                  View all on DBLP
                </ExternalLink>
              </div>
              <ol className="publication-list">
                {publications.map((publication) => (
                  <li key={publication.title}>
                    <div className="publication-meta">
                      <span>{publication.year}</span>
                      <span>{publication.venue}</span>
                      <span>{publication.role}</span>
                    </div>
                    <ExternalLink href={publication.href}>
                      {publication.title}
                    </ExternalLink>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <div className="record-title-row">
                <h3>Patents & applications</h3>
              </div>
              <ol className="patent-list">
                {patents.map((patent) => (
                  <li key={patent.number}>
                    <div className="patent-number">
                      <span>{patent.number}</span>
                      <span>{patent.year}</span>
                    </div>
                    <ExternalLink href={patent.href}>{patent.title}</ExternalLink>
                    <p>{patent.context}</p>
                  </li>
                ))}
              </ol>

              <div className="talks">
                <p className="mini-label">SELECTED TALKS</p>
                <ExternalLink href="https://atscaleconference.com/videos/live-traffic-load-testing-measuring-and-validating-capacity-at-facebook/">
                  Live Traffic Load-Testing: Measuring and Validating Capacity at Facebook
                </ExternalLink>
                <span>Systems @Scale · 2022</span>
                <ExternalLink href="https://www.pdl.cmu.edu/SDI/2013/062013.html">
                  Just-in-Time Provisioning for Cyber Foraging
                </ExternalLink>
                <span>CMU SDI Seminar · 2013</span>
              </div>
            </div>
          </div>
        </section>

        <section className="closing" aria-labelledby="closing-title">
          <p className="eyebrow">SYSTEMS · CAPACITY · AI INFRASTRUCTURE</p>
          <h2 id="closing-title">Build for the peak. Learn from every cycle.</h2>
          <p>
            I work where distributed systems, infrastructure economics, and
            operational safety meet.
          </p>
          <div className="closing-links">
            <ExternalLink
              className="button button-light"
              href="https://www.linkedin.com/in/kiryong-ha"
            >
              Connect on LinkedIn
            </ExternalLink>
            <ExternalLink className="text-link" href="https://github.com/krha">
              GitHub
            </ExternalLink>
            <ExternalLink className="text-link" href="https://dblp.org/pid/01/4626">
              DBLP
            </ExternalLink>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <span>Kiryong Ha · 하기룡</span>
          <span>Principal Engineer · Distributed Systems</span>
        </div>
        <p>
          © 2026 Kiryong Ha. Views are my own. Meta and other product names are
          trademarks of their respective owners.
        </p>
      </footer>
    </>
  );
}
