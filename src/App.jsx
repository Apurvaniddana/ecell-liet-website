import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, ExternalLink,
  Instagram, Linkedin, Menu, Search, Sparkles, Target, Users, X, Zap,
  Plus, Pencil, Trash2, Save, Eye, LogOut, LockKeyhole, RefreshCw
} from "lucide-react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "./supabase";

const CONTENT = "/content";

function useBlogs() {
  const fallback = useJson("blogs.json", []);
  const [blogs, setBlogs] = useState(fallback);

  const load = async () => {
    if (!isSupabaseConfigured) {
      setBlogs(fallback);
      return;
    }
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase blog load error:", error);
      setBlogs(fallback);
      return;
    }
    setBlogs((data || []).map(normalizeBlog));
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("ecell-blogs-updated", handler);
    return () => window.removeEventListener("ecell-blogs-updated", handler);
  }, [fallback.length]);

  return [blogs, load];
}

function normalizeBlog(row) {
  let stored = {};
  try {
    stored = typeof row.content === "string" ? JSON.parse(row.content || "{}") : (row.content || {});
  } catch {
    stored = { paragraphs: row.content ? [row.content] : [] };
  }
  const paragraphs = Array.isArray(stored)
    ? stored
    : (stored.paragraphs || []);
  return {
    ...row,
    id: row.id,
    date: stored.date || row.created_at?.slice(0, 10) || "",
    image: row.cover_image || stored.image || "",
    excerpt: stored.excerpt || "",
    content: paragraphs
  };
}

function useJson(file, fallback) {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    fetch(`${CONTENT}/${file}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setData)
      .catch(() => setData(fallback));
  }, [file]);
  return data;
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const links = [
    ["/about", "About"], ["/members", "Members"], ["/blogs", "Blogs"]
  ];
  return (
    <header className="header">
      <div className="topline">LIET · ENTREPRENEURSHIP · INNOVATION · LEADERSHIP · STUDENT COMMUNITY</div>
      <div className="container nav-wrap">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">E</span>
          <span><b>E-CELL</b><small>LIET · LENDI INSTITUTE</small></span>
        </Link>
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "nav open" : "nav"}>
  <Link
    className={location.pathname === "/" ? "active" : ""}
    to="/"
    onClick={() => setOpen(false)}
  >
    Home
  </Link>

  {links.map(([href, label]) => (
    <Link
      key={href}
      className={location.pathname === href ? "active" : ""}
      to={href}
      onClick={() => setOpen(false)}
    >
      {label}
    </Link>
  ))}

  <Link
    className={location.pathname === "/admin" ? "active admin-nav" : "admin-nav"}
    to="/admin"
    onClick={() => setOpen(false)}
  >
    Admin
  </Link>

  <Link
    className="nav-cta"
    to="/blogs"
    onClick={() => setOpen(false)}
  >
    Explore E-Cell <ArrowUpRight size={16} />
  </Link>
</nav>
      </div>
    </header>
  );
}

function Footer() {
  return <footer className="footer">
    <div className="container footer-grid">
      <div><div className="footer-logo">E-CELL LIET</div><p>Entrepreneurship · Innovation · Leadership</p></div>
      <div><b>Explore</b><Link to="/about">About</Link><Link to="/members">Members</Link><Link to="/blogs">Blogs</Link></div>
      <div><b>Institution</b><p>Lendi Institute of Engineering and Technology</p><p>Vizianagaram, Andhra Pradesh</p></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} E-Cell LIET</span><span>Built for the student entrepreneurship community.</span></div>
  </footer>;
}

function Layout({ children }) { return <><Header />{children}<Footer /></>; }

function SectionLabel({children}) { return <div className="eyebrow"><i></i>{children}</div>; }

function Home() {
  return <main>
    <section className="hero">
      <div className="hero-grid container">
        <div className="hero-copy">
          <SectionLabel>ENTREPRENEURSHIP CELL · LIET</SectionLabel>
          <h1>Ideas become <em>action.</em></h1>
          <p className="hero-lead">A student-driven community creating space for entrepreneurship, innovation and leadership at LIET.</p>
          <div className="hero-actions"><Link className="btn dark" to="/about">Discover E-Cell <ArrowRight size={18}/></Link><Link className="text-link" to="/members">Meet the team <ArrowUpRight size={17}/></Link></div>
          <div className="hero-stats"><div><strong>25+</strong><span>Team roles</span></div><div><strong>∞</strong><span>Ideas to explore</span></div><div><strong>01</strong><span>Shared mission</span></div></div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo" style={{backgroundImage:"url(https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85)"}}></div>
          <div className="floating-card"><Sparkles size={18}/><span>Build. Learn. Connect.</span></div>
          <div className="hero-number">01</div>
        </div>
      </div>
    </section>
    <section className="marquee"><div>INNOVATION <span>✦</span> STARTUPS <span>✦</span> COMMUNITY <span>✦</span> LEADERSHIP <span>✦</span> INNOVATION <span>✦</span> STARTUPS <span>✦</span></div></section>
    <section className="section intro">
      <div className="container two-col"><div><SectionLabel>WHY E-CELL</SectionLabel><h2>Learn by <em>building.</em></h2></div><div className="copy"><p className="large">E-Cell creates opportunities for students to move beyond classroom learning and experience entrepreneurship through practical activities, collaboration and interaction with the entrepreneurial ecosystem.</p><Link className="text-link" to="/about">Read our story <ArrowUpRight size={17}/></Link></div></div>
    </section>
    <section className="section soft"><div className="container">
      <div className="section-head"><div><SectionLabel>EXPLORE</SectionLabel><h2>One community.<br/><em>Many ways to grow.</em></h2></div><Link className="text-link" to="/blogs">View stories <ArrowUpRight size={17}/></Link></div>
      <div className="feature-grid">
        <Link to="/members" className="feature-card"><div className="feature-icon"><Users/></div><span>01</span><h3>People</h3><p>Meet the student leaders working across innovation, events, technology, media and outreach.</p><ArrowUpRight/></Link>
        <Link to="/blogs" className="feature-card"><div className="feature-icon"><Zap/></div><span>02</span><h3>Ideas</h3><p>Read practical stories and perspectives around entrepreneurship, startups and student innovation.</p><ArrowUpRight/></Link>
        <Link to="/about" className="feature-card"><div className="feature-icon"><Target/></div><span>03</span><h3>Purpose</h3><p>Understand the vision, mission and activities shaping the E-Cell community.</p><ArrowUpRight/></Link>
      </div>
    </div></section>
    <section className="cta"><div className="container cta-inner"><SectionLabel>YOUR NEXT IDEA</SectionLabel><h2>Start with a <em>problem.</em><br/>Build toward a solution.</h2><Link className="btn light" to="/about">Learn about E-Cell <ArrowRight size={18}/></Link></div></section>
  </main>;
}

function About() {
  const about = useJson("about.json", {});
  return <main>
    <PageHero kicker="WHO WE ARE" title={<>About <em>E-Cell.</em></>} text="A student-driven platform for entrepreneurship, innovation and leadership at LIET."/>
    <section className="section"><div className="container two-col about-grid"><div><SectionLabel>OUR STORY</SectionLabel><h2>Creating a space where <em>ideas can grow.</em></h2></div><div className="copy"><p className="large">{about.intro}</p><p>{about.purpose}</p><p>{about.nec}</p></div></div></section>
    <section className="section soft"><div className="container"><div className="vision-grid"><div className="vision-card"><SectionLabel>VISION</SectionLabel><h3>Build the environment.</h3><p>{about.vision}</p></div><div className="vision-card dark-card"><SectionLabel>MISSION</SectionLabel><h3>Turn learning into action.</h3><p>{about.mission}</p></div></div></div></section>
    <section className="section"><div className="container"><SectionLabel>WHAT WE DO</SectionLabel><h2 className="section-title">Learning through <em>action.</em></h2><div className="activity-list">{(about.activities || []).map((x,i)=><div key={x}><span>0{i+1}</span><b>{x}</b><ArrowUpRight/></div>)}</div></div></section>
  </main>;
}

function PageHero({kicker,title,text}) {
  return <section className="page-hero"><div className="container"><SectionLabel>{kicker}</SectionLabel><h1>{title}</h1>{text && <p>{text}</p>}</div></section>;
}

function Members() {
  const members = useJson("members.json", []);
  const [q,setQ] = useState(""); const [group,setGroup] = useState("All");
  const groups = ["All", ...new Set(members.map(m=>m.group))];
  const filtered = useMemo(() => members.filter(m => {
    const hay = `${m.name} ${m.role} ${m.group}`.toLowerCase();
    return hay.includes(q.toLowerCase()) && (group === "All" || m.group === group);
  }), [members,q,group]);
  return <main><PageHero kicker="OUR PEOPLE" title={<>Meet the <em>E-Cell team.</em></>} text="Student leaders working together to build an entrepreneurial culture at LIET."/>
    <section className="section"><div className="container">
      <div className="controls"><label className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search members"/></label><div className="chips">{groups.map(x=><button key={x} className={group===x?"selected":""} onClick={()=>setGroup(x)}>{x}</button>)}</div></div>
      <div className="member-grid">{filtered.map(m=><article className="member-card" key={m.id}><div className="member-image">{m.image ? <img src={m.image} alt={m.name}/> : <div className="avatar">{m.name.split(" ").filter(Boolean).map(x=>x[0]).slice(0,2).join("")}</div>}{m.placeholder && <span className="pending">Name pending</span>}</div><div className="member-info"><small>{m.group}</small><h3>{m.name}</h3><p>{m.role}</p>{m.responsibilities?.length > 0 && <details className="member-responsibilities"><summary>Responsibilities</summary><ul>{m.responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul></details>}<div className="member-bio">{m.bio}</div></div></article>)}</div>
      {filtered.length===0 && <div className="empty">No members match your search.</div>}
    </div></section>
  </main>;
}

function Blogs() {
  const [blogs] = useBlogs();
  const [category,setCategory]=useState("All"); const [sort,setSort]=useState("newest");
  const categories=["All",...new Set(blogs.map(b=>b.category).filter(Boolean))];
  const filtered=[...blogs].filter(b=>category==="All"||b.category===category).sort((a,b)=>sort==="newest"?new Date(b.date)-new Date(a.date):new Date(a.date)-new Date(b.date));
  return <main><PageHero kicker="E-CELL STORIES" title={<>Ideas worth <em>sharing.</em></>} text="Stories, insights and practical perspectives from the entrepreneurial community."/>
    <section className="section"><div className="container">
      <div className="blog-toolbar"><div className="chips">{categories.map(x=><button key={x} className={category===x?"selected":""} onClick={()=>setCategory(x)}>{x}</button>)}</div><label className="sort">Sort <select value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option></select><ChevronDown size={15}/></label></div>
      <div className="blog-grid">{filtered.map((b,i)=><Link className={i===0?"blog-card featured":"blog-card"} to={`/blogs/${b.slug}`} key={b.id}><div className="blog-cover" style={{backgroundImage:`url(${b.image || `https://images.unsplash.com/photo-${["1552664730-d307ca884978","1551836022-dcedb1310c13","1521737711867-e3b97375f902","1523240795612-9a054b0db644"][i%4]}?auto=format&fit=crop&w=1200&q=80`})`}}><span>{b.category}</span></div><div className="blog-content"><div className="blog-meta"><span><CalendarDays size={14}/> {new Date(b.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span><span>{b.author}</span></div><h3>{b.title}</h3><p>{b.excerpt}</p><span className="read">Read article <ArrowUpRight size={16}/></span></div></Link>)}</div>
      {filtered.length===0 && <div className="empty">No published blogs yet.</div>}
    </div></section>
  </main>;
}


function useComments(blogId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    if (!supabase || !blogId) {
      setComments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("id, name, comment, created_at")
      .eq("blog_id", blogId)
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase comments load error:", error);
      setComments([]);
    } else {
      setComments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [blogId]);

  return [comments, loadComments, loading];
}

function Admin() {
  const [blogs, refreshBlogs] = useBlogs();
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [form, setForm] = useState({
    title:"", author:"E-Cell LIET", date:new Date().toISOString().slice(0,10),
    category:"Entrepreneurship", excerpt:"", image:"", content:[""]
  });
  const [editing,setEditing]=useState(null);
  const [message,setMessage]=useState("");
  const [saving,setSaving]=useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
      if (data.session) refreshBlogs();
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setAuthLoading(false);
      if (next) refreshBlogs();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const blank = {
    title:"", author:"E-Cell LIET", date:new Date().toISOString().slice(0,10),
    category:"Entrepreneurship", excerpt:"", image:"", content:[""]
  };

  const slugify = (value) => value.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");

  const login = async (e) => {
    e.preventDefault();
    setAuthMessage("");
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthMessage(error.message);
  };

  const logout = async () => {
    await supabase?.auth.signOut();
    setSession(null);
    setMessage("");
  };

  const editBlog = (blog) => {
    setEditing(blog.id);
    setForm({
      title: blog.title || "",
      author: blog.author || "E-Cell LIET",
      date: blog.date || new Date().toISOString().slice(0,10),
      category: blog.category || "Entrepreneurship",
      excerpt: blog.excerpt || "",
      image: blog.image || "",
      content: blog.content?.length ? blog.content : [""]
    });
    setMessage("");
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const reset = () => { setEditing(null); setForm(blank); setMessage(""); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.some(x=>x.trim())) {
      setMessage("Please fill in the title, excerpt and article content.");
      return;
    }
    if (!supabase || !session) return;

    setSaving(true);
    setMessage("");
    const baseSlug = slugify(form.title);
    let slug = baseSlug;

    if (!editing) {
      const { data: existing } = await supabase.from("blogs").select("id").eq("slug", slug).maybeSingle();
      if (existing) slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;
    }

    const payload = {
      title: form.title.trim(),
      slug,
      author: form.author.trim() || "E-Cell LIET",
      category: form.category.trim() || "Entrepreneurship",
      content: JSON.stringify({
        date: form.date,
        excerpt: form.excerpt.trim(),
        image: form.image.trim(),
        paragraphs: form.content.filter(x=>x.trim())
      }),
      cover_image: form.image.trim() || null,
      published: true
    };

    const result = editing
      ? await supabase.from("blogs").update(payload).eq("id", editing).select().single()
      : await supabase.from("blogs").insert(payload).select().single();

    if (result.error) {
      setMessage(result.error.message);
      setSaving(false);
      return;
    }

    setMessage(editing ? "Blog updated and published." : "Blog published successfully.");
    reset();
    await refreshBlogs();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this blog permanently?")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (editing===id) reset();
    setMessage("Blog deleted.");
    await refreshBlogs();
  };

  const updateContent = (index,value) =>
    setForm({...form,content:form.content.map((x,i)=>i===index?value:x)});

  if (authLoading) {
    return <main><div className="empty-page"><RefreshCw className="spin"/><h1>Checking admin access…</h1></div></main>;
  }

  if (!isSupabaseConfigured) {
    return <main>
      <PageHero kicker="ADMIN" title={<>Connect <em>Supabase.</em></>} text="The website is ready for online blog management, but its Supabase environment variables have not been added yet."/>
      <section className="section"><div className="container admin-note">
        <strong>Setup required:</strong> Create a `.env` file in the project root with
        <pre>{`VITE_SUPABASE_URL=your_project_url\nVITE_SUPABASE_ANON_KEY=your_publishable_or_anon_key`}</pre>
        Then restart Vite with <code>npm run dev</code>.
      </div></section>
    </main>;
  }

  if (!session) {
    return <main>
      <PageHero kicker="ADMIN" title={<>Admin <em>Login.</em></>} text="Sign in with the E-Cell administrator account to manage published stories."/>
      <section className="section"><div className="container admin-login-wrap">
        <form className="admin-login" onSubmit={login}>
          <div className="admin-login-icon"><LockKeyhole size={24}/></div>
          <SectionLabel>SECURE ACCESS</SectionLabel>
          <h2>Welcome back.</h2>
          <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" required/></label>
          <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" required/></label>
          <button className="btn dark" type="submit">Sign in <ArrowRight size={17}/></button>
          {authMessage && <p className="admin-message error">{authMessage}</p>}
        </form>
      </div></section>
    </main>;
  }

  return <main>
    <PageHero kicker="ADMIN" title={<>Blog <em>Management.</em></>} text={`Signed in as ${session.user.email}. Manage E-Cell stories from one place.`}/>
    <section className="section admin-section"><div className="container admin-layout">
      <form className="admin-form" onSubmit={submit}>
        <div className="admin-form-head"><div><SectionLabel>{editing ? "EDIT ARTICLE" : "NEW ARTICLE"}</SectionLabel><h2>{editing ? "Update a blog." : "Publish a blog."}</h2></div>
          <button type="button" className="btn-outline" onClick={logout}><LogOut size={15}/> Sign out</button>
        </div>
        <label>Title<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Enter blog title"/></label>
        <div className="admin-two"><label>Author<input value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/></label><label>Date<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label></div>
        <div className="admin-two"><label>Category<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Entrepreneurship"/></label><label>Cover image URL<input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..."/></label></div>
        <label>Short excerpt<textarea rows="3" value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} placeholder="Short description shown on the Blogs page"/></label>
        <label>Article content</label>
        <div className="paragraph-editor">{form.content.map((p,i)=><div className="paragraph-row" key={i}><textarea rows="5" value={p} onChange={e=>updateContent(i,e.target.value)} placeholder={`Paragraph ${i+1}`}/>{form.content.length>1 && <button type="button" className="icon-btn" onClick={()=>setForm({...form,content:form.content.filter((_,j)=>j!==i)})}><Trash2 size={16}/></button>}</div>)}</div>
        <button type="button" className="add-paragraph" onClick={()=>setForm({...form,content:[...form.content,""]})}><Plus size={16}/> Add paragraph</button>
        <button className="btn dark admin-publish" type="submit" disabled={saving}><Save size={17}/>{saving ? "Saving…" : editing ? "Update & Publish" : "Publish Blog"}</button>
        {editing && <button type="button" className="btn-outline cancel-edit" onClick={reset}>Cancel edit</button>}
        {message && <p className="admin-message">{message}</p>}
      </form>
      <aside className="admin-list"><div className="admin-list-head"><div><SectionLabel>DATABASE</SectionLabel><h3>{blogs.length} Articles</h3></div><Eye size={20}/></div>
        {blogs.map(b=><div className="admin-blog-row" key={b.id}><div><strong>{b.title}</strong><small>{b.category} · {b.date}</small></div><div className="admin-actions"><button className="icon-btn" onClick={()=>editBlog(b)} title="Edit"><Pencil size={16}/></button><button className="icon-btn danger" onClick={()=>remove(b.id)} title="Delete"><Trash2 size={16}/></button></div></div>)}
      </aside>
    </div></section>
  </main>;
}


function BlogDetail() {
  const {slug}=useParams();
  const [blogs]=useBlogs();
  const blog=blogs.find(b=>b.slug===slug);
  const [comments, refreshComments, commentsLoading] = useComments(blog?.id);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentSaving, setCommentSaving] = useState(false);

  if(!blog) return <main><div className="empty-page"><h1>Article not found</h1><Link className="btn dark" to="/blogs">Back to stories</Link></div></main>;

  const submitComment = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanComment = comment.trim();

    if (!cleanName || !cleanComment) {
      setCommentMessage("Please enter your name and comment.");
      return;
    }

    if (!supabase) {
      setCommentMessage("Comments are currently unavailable.");
      return;
    }

    setCommentSaving(true);
    setCommentMessage("");

    const { error } = await supabase.from("comments").insert({
      blog_id: blog.id,
      name: cleanName,
      comment: cleanComment,
      approved: true
    });

    if (error) {
      console.error("Supabase comment insert error:", error);
      setCommentMessage(error.message);
      setCommentSaving(false);
      return;
    }

    setName("");
    setComment("");
    setCommentMessage("Comment posted successfully.");
    await refreshComments();
    setCommentSaving(false);
  };

  return <main>
    <PageHero kicker={blog.category.toUpperCase()} title={<>{blog.title}</>} text={`${blog.author} · ${new Date(blog.date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}`}/>
    <article className="article">
      <div className="article-cover-large" style={{backgroundImage:`url(${blog.image || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=85"})`}}></div>
      <div className="article-body">
        {blog.content.map((p,i)=><p className={i===0?"lead":""} key={i}>{p}</p>)}

        <section className="comments-section">
          <div className="comments-heading">
            <SectionLabel>COMMUNITY</SectionLabel>
            <h2>Comments <span>({comments.length})</span></h2>
            <p>Share your thoughts about this story.</p>
          </div>

          <form className="comment-form" onSubmit={submitComment}>
            <label>
              Your name
              <input
                type="text"
                value={name}
                onChange={e=>setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={80}
                required
              />
            </label>
            <label>
              Your comment
              <textarea
                value={comment}
                onChange={e=>setComment(e.target.value)}
                placeholder="Write your comment..."
                rows="5"
                maxLength={1000}
                required
              />
            </label>
            <button className="btn dark" type="submit" disabled={commentSaving}>
              {commentSaving ? "Posting…" : "Post Comment"} <ArrowRight size={17}/>
            </button>
            {commentMessage && <p className={commentMessage.includes("successfully") ? "comment-message success" : "comment-message error"}>{commentMessage}</p>}
          </form>

          <div className="comments-list">
            {commentsLoading ? (
              <div className="comments-empty">Loading comments…</div>
            ) : comments.length === 0 ? (
              <div className="comments-empty">No comments yet. Be the first to share your thoughts.</div>
            ) : (
              comments.map(item => (
                <article className="comment-card" key={item.id}>
                  <div className="comment-avatar">
                    {item.name.trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="comment-body">
                    <div className="comment-meta">
                      <strong>{item.name}</strong>
                      <span>{new Date(item.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span>
                    </div>
                    <p>{item.comment}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <Link className="text-link" to="/blogs">Back to all stories <ArrowUpRight size={17}/></Link>
      </div>
    </article>
  </main>;
}

function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/members" element={<Members/>}/>
    <Route path="/blogs" element={<Blogs/>}/><Route path="/blogs/:slug" element={<BlogDetail/>}/><Route path="/admin" element={<Admin/>}/>
    <Route path="*" element={<main><div className="empty-page"><h1>Page not found</h1><Link className="btn dark" to="/">Go home</Link></div></main>}/>
  </Routes></Layout>;
}


export default App;
