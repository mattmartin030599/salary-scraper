'use client'

import { useState } from 'react'

const TOPICS = [
  { value: '',               label: 'Select a topic…'        },
  { value: 'bug',            label: 'Bug report'              },
  { value: 'feature',        label: 'Feature request'         },
  { value: 'data',           label: 'Wrong or missing salary' },
  { value: 'partnership',    label: 'Partnership enquiry'     },
  { value: 'other',          label: 'Other'                   },
]

export default function ContactPage() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [topic,   setTopic]   = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const topicLabel = TOPICS.find(t => t.value === topic)?.label ?? topic
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topicLabel}\n\n${message}`
    )
    window.location.href = `mailto:contact@salaryscraper.com.au?subject=${encodeURIComponent(`[Salary Scraper] ${topicLabel}`)}&body=${body}`
    setSent(true)
  }

  const inputCls =
    'w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 ' +
    'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ' +
    'placeholder:text-gray-400 dark:placeholder:text-gray-600 ' +
    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ' +
    'transition-colors'

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-20">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/70 dark:border-brand-900 bg-brand-50/80 dark:bg-brand-950/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-4">
            Contact
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
            Get in <span className="text-gradient">touch</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            Found a bug? Have a suggestion? We'd love to hear from you.
          </p>
        </div>

        <div className="grid sm:grid-cols-5 gap-8">

          {/* Contact form */}
          <div className="sm:col-span-3">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-6 card-surface">
                <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center mb-4 shadow-lift">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-white">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Your email client is ready
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your message has been pre-filled in your mail app. Just hit send!
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-5 text-xs text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="card-surface p-6 space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Topic
                  </label>
                  <select
                    required
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className={inputCls}
                  >
                    {TOPICS.map(t => (
                      <option key={t.value} value={t.value} disabled={!t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us more…"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <button type="submit" className="btn-brand w-full py-3 text-sm">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z"/>
                  </svg>
                  Send message
                </button>
              </form>
            )}
          </div>

          {/* Direct contact card */}
          <div className="sm:col-span-2 space-y-4">
            <div className="card-surface p-5">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-3">
                Direct email
              </h3>
              <a
                href="mailto:contact@salaryscraper.com.au"
                className="flex items-center gap-2.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z"/>
                  <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z"/>
                </svg>
                contact@salaryscraper.com.au
              </a>
            </div>

            <div className="card-surface p-5">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-3">
                Response time
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                We aim to reply within 2 business days. For urgent bugs, please include your browser and operating system.
              </p>
            </div>

            <div className="bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/40 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-brand-700 dark:text-brand-400 uppercase tracking-widest mb-2">
                Found a missing salary?
              </h3>
              <p className="text-xs text-brand-600 dark:text-brand-500 leading-relaxed">
                If Salary Scraper couldn't find a salary you think should be there, paste the Seek URL in your message and we'll investigate.
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  )
}
