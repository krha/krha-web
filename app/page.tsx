import type { ReactNode } from "react";

const publicWork = [
  {
    year: "2023",
    title: "Global Capacity Management with Flux",
    role: "Acknowledged Flux team member in the OSDI ’23 paper",
    description:
      "Flux automates regional capacity planning across thousands of services, tens of regions, and millions of servers in Meta’s private cloud.",
    href: "https://www.usenix.org/conference/osdi23/presentation/eriksen",
    linkLabel: "OSDI ’23 paper",
  },
  {
    year: "2022",
    title: "Live Traffic Load Testing at Facebook Scale",
    role: "Speaker with Lin Xiao · Systems @Scale",
    description:
      "A production approach for measuring maximum safe service throughput while workloads, software, hardware, and dependencies continue to change.",
    href: "https://atscaleconference.com/videos/live-traffic-load-testing-measuring-and-validating-capacity-at-facebook/",
    linkLabel: "Watch the talk",
  },
  {
    year: "2020",
    title: "Throughput Autoscaling for Facebook.com",
    role: "Co-author · Engineering at Meta",
    description:
      "Workload-driven sizing combines demand prediction, disaster modeling, live-traffic supply measurement, and safety controls to release off-peak capacity for other workloads.",
    href: "https://engineering.fb.com/2020/09/14/networking-traffic/throughput-autoscaling/",
    linkLabel: "Engineering article",
  },
  {
    year: "2019",
    title: "Taiji: Managing Global User Traffic",
    role: "Co-author · SOSP ’19",
    description:
      "A constraint-optimization system that balances data-center utilization and network latency while adapting global traffic routing to demand and failures.",
    href: "https://doi.org/10.1145/3341301.3359655",
    linkLabel: "SOSP ’19 paper",
  },
];

const publications = [
  {
    year: "2019",
    venue: "SOSP",
    title:
      "Taiji: Managing Global User Traffic for Large-Scale Internet Services at the Edge",
    href: "https://doi.org/10.1145/3341301.3359655",
  },
  {
    year: "2017",
    venue: "SEC",
    title: "You Can Teach Elephants to Dance: Agile VM Handoff for Edge Computing",
    href: "https://doi.org/10.1145/3132211.3134453",
  },
  {
    year: "2016",
    venue: "Ph.D. thesis",
    title: "System Infrastructure for Mobile-Cloud Convergence",
    href: "https://kilthub.cmu.edu/articles/thesis/System_Infrastructure_for_Mobile-Cloud_Convergence/6723461",
  },
  {
    year: "2014",
    venue: "MobiSys",
    title: "Towards Wearable Cognitive Assistance",
    href: "https://doi.org/10.1145/2594368.2594383",
  },
  {
    year: "2013",
    venue: "MobiSys",
    title: "Just-in-Time Provisioning for Cyber Foraging",
    href: "https://doi.org/10.1145/2462456.2464451",
  },
  {
    year: "2013",
    venue: "IC2E",
    title: "The Impact of Mobile Multimedia Applications on Data Center Consolidation",
    href: "https://doi.org/10.1109/IC2E.2013.36",
  },
];

const career = [
  {
    period: "Current",
    organization: "Meta",
    role: "Principal Engineer (E8)",
    detail:
      "Private-cloud capacity management and capacity fulfillment for hyper-scale products like Facebook and Instagram.",
    href: "https://research.facebook.com/fellows/ha-kiryong/",
  },
  {
    period: "2011–2016",
    organization: "Carnegie Mellon University",
    role: "Ph.D., Electrical & Computer Engineering",
    detail:
      "Systems infrastructure for mobile–cloud convergence under Mahadev Satyanarayanan.",
    href: "https://kilthub.cmu.edu/articles/thesis/System_Infrastructure_for_Mobile-Cloud_Convergence/6723461",
  },
  {
    period: "Summer 2014",
    organization: "Microsoft Research",
    role: "Research Intern · Edge Computing",
    detail: "GPU-state migration between edge and data-center systems.",
    href: "https://www.microsoft.com/en-us/research/project/edge-computing/people/",
  },
  {
    period: "2007–2011",
    organization: "ETRI",
    role: "Research Staff",
    detail:
      "Virtualization, on-demand computing, and context-aware healthcare systems.",
  },
  {
    period: "2000–2007",
    organization: "KAIST",
    role: "B.S., EECS · M.S., BioSystems",
    detail: "Computing systems, signals, and applied research.",
  },
];

const patents = [
  {
    number: "US 10,931,743",
    year: "2021",
    title:
      "Dynamically generating routing tables for edge nodes in large-scale networking infrastructures",
    href: "https://patents.justia.com/patent/10931743",
  },
  {
    number: "US 9,965,823",
    year: "2018",
    title: "Migration of graphics processing unit (GPU) states",
    href: "https://patents.google.com/patent/US9965823B2/en",
  },
  {
    number: "US 2011/0173319",
    year: "2011",
    title: "Apparatus and method for operating a server using virtualization technique",
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
  image: "https://krha.kr/kiryong-ha.jpg",
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
    "https://scholar.google.com/citations?user=Wj7l5TsAAAAJ&hl=en",
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
  children: ReactNode;
  className?: string;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <span className="external-mark" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id}>{children}</h2>;
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

      <header className="navbar">
        <div className="navbar-inner">
          <a className="navbar-brand" href="#top">
            Kiryong Ha <span>(하기룡)</span>
          </a>
          <nav aria-label="Primary navigation">
            <a href="#career">Career</a>
            <a href="#work">Research</a>
            <a href="#publications">Publications</a>
            <ExternalLink href="https://www.linkedin.com/in/kiryong-ha">
              LinkedIn
            </ExternalLink>
          </nav>
        </div>
      </header>

      <main className="page-shell" id="top">
        <aside className="sidebar" aria-label="Profile and section navigation">
          <div className="profile">
            <img
              className="profile-photo"
              src="/kiryong-ha.jpg"
              alt="Kiryong Ha"
              width="960"
              height="960"
            />
            <p className="profile-role">
              Principal Engineer (E8) at Meta
              <br />
              Private Cloud Capacity &amp; Fulfillment Infrastructure
            </p>
            <div className="profile-links" aria-label="External profiles">
              <ExternalLink href="https://www.linkedin.com/in/kiryong-ha">
                LinkedIn
              </ExternalLink>
              <ExternalLink href="https://github.com/krha">GitHub</ExternalLink>
            </div>
          </div>

          <nav className="section-nav" aria-label="On this page">
            <a href="#about">About</a>
            <a href="#focus">Current Focus</a>
            <a href="#career">Career</a>
            <a href="#work">Selected Public Work</a>
            <a href="#publications">Selected Publications</a>
            <a href="#patents">Patents &amp; Talks</a>
          </nav>
        </aside>

        <div className="content">
          <section className="content-section" aria-labelledby="about">
            <SectionTitle id="about">About</SectionTitle>
            <p className="lead">
              I am a Principal Engineer (E8) at Meta currently working on
              hyperscale capacity management and capacity fulfillment for
              Meta&apos;s private cloud.
            </p>
            <p>
              My work focuses on turning demand forecasts, measured supply,
              service constraints, and infrastructure availability into
              reliable capacity decisions. The goal is straightforward to
              state and hard to execute at scale: put the right compute in the
              right place at the right time, while preserving reliability and
              efficiency.
            </p>
            <p>
              Over the course of my career, I have worked across global traffic
              routing, throughput autoscaling, live traffic load testing,
              regional capacity planning, mobile–cloud systems, cloudlets, and
              edge computing. I received my Ph.D. in Electrical &amp; Computer
              Engineering from Carnegie Mellon University.
            </p>
          </section>

          <section className="content-section" aria-labelledby="focus">
            <SectionTitle id="focus">Current Focus</SectionTitle>
            <div className="focus-grid">
              <article>
                <h3>Capacity fulfillment</h3>
                <p>
                  Translating infrastructure demand into executable plans and
                  making capacity available where services need it.
                </p>
              </article>
              <article>
                <h3>AI/Non-AI infrastructure</h3>
                <p>
                  Applying private-cloud capacity systems to specialized AI
                  workloads and the diverse demands of non-AI product services.
                </p>
              </article>
              <article>
                <h3>Closed-loop systems</h3>
                <p>
                  Connecting forecasts, measured throughput, placement,
                  traffic, and delivery into reliable operating feedback loops.
                </p>
              </article>
            </div>
          </section>

          <section className="content-section" aria-labelledby="career">
            <SectionTitle id="career">Career</SectionTitle>
            <div className="career-list">
              {career.map((item) => (
                <article
                  className="career-item"
                  key={item.organization + item.period}
                >
                  <div className="career-period">{item.period}</div>
                  <div>
                    <h3>
                      {item.href ? (
                        <ExternalLink href={item.href}>
                          {item.organization}
                        </ExternalLink>
                      ) : (
                        item.organization
                      )}
                    </h3>
                    <p className="item-meta">{item.role}</p>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="content-section" aria-labelledby="work">
            <SectionTitle id="work">Selected Public Work</SectionTitle>
            <div className="work-list">
              {publicWork.map((item) => (
                <article className="work-item" key={item.title}>
                  <div className="work-year">{item.year}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p className="item-meta">{item.role}</p>
                    <p>{item.description}</p>
                    <ExternalLink className="source-link" href={item.href}>
                      {item.linkLabel}
                    </ExternalLink>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="content-section" aria-labelledby="publications">
            <SectionTitle id="publications">Selected Publications</SectionTitle>
            <p className="section-intro">
              A selection of peer-reviewed systems research. See the complete
              record on{
              " "
              }
              <ExternalLink href="https://dblp.org/pid/01/4626">DBLP</ExternalLink>{
              " "
              }
              or{
              " "
              }
              <ExternalLink href="https://scholar.google.com/citations?user=Wj7l5TsAAAAJ&hl=en">
                Google Scholar
              </ExternalLink>
              .
            </p>
            <ol className="publication-list">
              {publications.map((publication) => (
                <li key={publication.title}>
                  <div>
                    <ExternalLink href={publication.href}>
                      {publication.title}
                    </ExternalLink>
                    <p>
                      Kiryong Ha et al. · {publication.venue} · {publication.year}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="content-section" aria-labelledby="patents">
            <SectionTitle id="patents">Patents &amp; Talks</SectionTitle>
            <h3 className="subheading">Selected patents</h3>
            <ul className="plain-list">
              {patents.map((patent) => (
                <li key={patent.number}>
                  <ExternalLink href={patent.href}>{patent.title}</ExternalLink>
                  <span>
                    {patent.number} · {patent.year}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="subheading talks-heading">Selected talks</h3>
            <ul className="plain-list">
              <li>
                <ExternalLink href="https://atscaleconference.com/videos/live-traffic-load-testing-measuring-and-validating-capacity-at-facebook/">
                  Live Traffic Load Testing: Measuring and Validating Capacity at
                  Facebook
                </ExternalLink>
                <span>Systems @Scale · 2022</span>
              </li>
              <li>
                <ExternalLink href="https://www.cmu.edu/cylab/news_events/events/2013/ha-jit-provisioning.html">
                  Just-in-Time Provisioning for Cyber Foraging
                </ExternalLink>
                <span>Carnegie Mellon University · 2013</span>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <footer>
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} Kiryong Ha</p>
          <p>
            Principal Engineer · Private Cloud Capacity · AI Infrastructure
          </p>
        </div>
      </footer>
    </>
  );
}
