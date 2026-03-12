<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ec5b13",
                        "background-light": "#f8f6f6",
                        "background-dark": "#221610",
                    },
                    fontFamily: {
                        "display": ["Public Sans"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
<title>Personal OS - Analytics &amp; Insights</title>
</head>
<body class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
<div class="flex min-h-screen">
<!-- Sidebar Navigation -->
<aside class="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col fixed h-full">
<div class="p-6 flex items-center gap-3">
<div class="bg-primary rounded-lg p-2 text-white">
<span class="material-symbols-outlined">analytics</span>
</div>
<div>
<h1 class="text-lg font-bold leading-tight">Personal OS</h1>
<p class="text-xs text-slate-500 dark:text-slate-400">Analytics &amp; Insights</p>
</div>
</div>
<nav class="flex-1 px-4 space-y-1">
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="text-sm font-medium">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" href="#">
<span class="material-symbols-outlined">schedule</span>
<span class="text-sm font-medium">Timeline</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" href="#">
<span class="material-symbols-outlined">check_circle</span>
<span class="text-sm font-medium">Habits</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" href="#">
<span class="material-symbols-outlined">psychology</span>
<span class="text-sm font-medium">Skills</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg" href="#">
<span class="material-symbols-outlined">insights</span>
<span class="text-sm font-medium">Insights</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="text-sm font-medium">Settings</span>
</a>
</nav>
<div class="p-4 mt-auto">
<div class="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
<p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Streak</p>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary">local_fire_department</span>
<span class="text-xl font-bold">12 Days</span>
</div>
</div>
</div>
</aside>
<!-- Main Content Area -->
<main class="flex-1 ml-64 p-8">
<!-- Header Section -->
<header class="mb-8 flex justify-between items-end">
<div>
<h2 class="text-3xl font-black tracking-tight mb-2">Performance Analytics</h2>
<p class="text-slate-500 dark:text-slate-400 max-w-xl">Deep dive into your productivity, habits, and cognitive patterns across the last 30 days.</p>
</div>
<div class="flex gap-2">
<button class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium">Export Data</button>
<button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Generate Report</button>
</div>
</header>
<div class="grid grid-cols-12 gap-6">
<!-- Section 1: Where Did My Day Go -->
<section class="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<h3 class="text-lg font-bold mb-6 flex items-center gap-2">
<span class="material-symbols-outlined text-primary">history</span> Where Did My Day Go?
                    </h3>
<div class="flex flex-col md:flex-row gap-8">
<!-- Pie Chart Representation -->
<div class="w-full md:w-1/3 flex flex-col items-center justify-center">
<div class="relative size-48 rounded-full border-[16px] border-slate-100 dark:border-slate-800 flex items-center justify-center">
<div class="absolute inset-0 rounded-full border-[16px] border-primary border-t-transparent border-l-transparent rotate-45"></div>
<div class="text-center">
<span class="text-3xl font-bold">14.5</span>
<p class="text-xs text-slate-500">Hours Logged</p>
</div>
</div>
<div class="mt-6 space-y-2 w-full">
<div class="flex items-center justify-between text-xs">
<span class="flex items-center gap-2"><div class="size-2 rounded-full bg-primary"></div> Deep Work</span>
<span class="font-bold">7.2h (50%)</span>
</div>
<div class="flex items-center justify-between text-xs">
<span class="flex items-center gap-2"><div class="size-2 rounded-full bg-orange-300"></div> Learning</span>
<span class="font-bold">2.1h (15%)</span>
</div>
<div class="flex items-center justify-between text-xs">
<span class="flex items-center gap-2"><div class="size-2 rounded-full bg-slate-400"></div> Admin</span>
<span class="font-bold">1.5h (10%)</span>
</div>
<div class="flex items-center justify-between text-xs">
<span class="flex items-center gap-2"><div class="size-2 rounded-full bg-red-400"></div> Distraction</span>
<span class="font-bold">3.7h (25%)</span>
</div>
</div>
</div>
<!-- Timeline Visualization -->
<div class="flex-1">
<p class="text-sm font-semibold mb-4 text-slate-500">Daily Timeline (Last 24h)</p>
<div class="space-y-4">
<div class="relative h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex">
<div class="h-full bg-primary/40 w-[20%]" title="Sleep"></div>
<div class="h-full bg-slate-300 dark:bg-slate-700 w-[10%]" title="Morning Routine"></div>
<div class="h-full bg-primary w-[30%]" title="Deep Work Block"></div>
<div class="h-full bg-orange-300 w-[10%]" title="Learning"></div>
<div class="h-full bg-red-400 w-[15%]" title="Distraction/Social"></div>
<div class="h-full bg-primary/40 w-[15%]" title="Sleep"></div>
</div>
<div class="flex justify-between text-[10px] text-slate-400 uppercase font-bold px-1">
<span>12am</span><span>4am</span><span>8am</span><span>12pm</span><span>4pm</span><span>8pm</span><span>12am</span>
</div>
</div>
<div class="mt-8 grid grid-cols-2 gap-4">
<div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
<p class="text-xs text-slate-500">Most Productive Slot</p>
<p class="text-lg font-bold">09:15 - 11:45</p>
</div>
<div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
<p class="text-xs text-slate-500">Distraction Peak</p>
<p class="text-lg font-bold">15:30 - 16:45</p>
</div>
</div>
</div>
</div>
</section>
<!-- Section 6: AI-Powered Insights -->
<section class="col-span-12 lg:col-span-4 bg-primary text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
<div>
<h3 class="text-lg font-bold mb-4 flex items-center gap-2">
<span class="material-symbols-outlined">auto_awesome</span> Smart Insights
                        </h3>
<div class="space-y-4">
<div class="bg-white/10 p-3 rounded-lg border border-white/20">
<p class="text-sm">"Your deepest focus happens between <strong>9 AM and 11 AM</strong>. Protect this window at all costs."</p>
</div>
<div class="bg-white/10 p-3 rounded-lg border border-white/20">
<p class="text-sm">"Data shows your score drops by <strong>22%</strong> when you skip your morning stretching routine."</p>
</div>
<div class="bg-white/10 p-3 rounded-lg border border-white/20">
<p class="text-sm">"You're <strong>3x</strong> more likely to resist social media urges on days you log 7.5h+ of sleep."</p>
</div>
</div>
</div>
<button class="mt-6 w-full py-2 bg-white text-primary font-bold rounded-lg text-sm hover:bg-slate-50">View Full Optimization Strategy</button>
</section>
<!-- Section 2: Daily Score Trend -->
<section class="col-span-12 lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-bold flex items-center gap-2">
<span class="material-symbols-outlined text-primary">trending_up</span> Daily Score Trend
                        </h3>
<div class="flex gap-2">
<span class="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">Streak: 12d (x1.4)</span>
</div>
</div>
<div class="h-64 flex items-end gap-1 px-2">
<!-- Simulated Line Chart with Bar Placeholders -->
<div class="flex-1 bg-primary/20 rounded-t h-[40%]"></div>
<div class="flex-1 bg-primary/20 rounded-t h-[45%]"></div>
<div class="flex-1 bg-primary/20 rounded-t h-[35%]"></div>
<div class="flex-1 bg-primary/20 rounded-t h-[60%]"></div>
<div class="flex-1 bg-primary/20 rounded-t h-[55%]"></div>
<div class="flex-1 bg-primary/20 rounded-t h-[70%]"></div>
<div class="flex-1 bg-primary/20 rounded-t h-[80%]"></div>
<div class="flex-1 bg-primary/20 rounded-t h-[65%]"></div>
<div class="flex-1 bg-primary/20 rounded-t h-[75%]"></div>
<div class="flex-1 bg-primary/40 rounded-t h-[85%]"></div>
<div class="flex-1 bg-primary/40 rounded-t h-[90%] border-t-2 border-primary"></div>
<div class="flex-1 bg-primary rounded-t h-[95%]"></div>
</div>
<div class="flex justify-between mt-4 text-[10px] text-slate-400 uppercase font-bold">
<span>30 Days Ago</span>
<span>Today</span>
</div>
</section>
<!-- Section 4: Productivity Correlations -->
<section class="col-span-12 lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<h3 class="text-lg font-bold mb-6 flex items-center gap-2">
<span class="material-symbols-outlined text-primary">scatter_plot</span> Correlations
                    </h3>
<div class="space-y-6">
<div>
<p class="text-xs font-semibold mb-3 text-slate-500 uppercase tracking-wider">Sleep Quality vs. Daily Score</p>
<div class="h-24 relative bg-slate-50 dark:bg-slate-800/50 rounded-lg">
<!-- Scatter plot dots -->
<div class="absolute size-2 bg-primary rounded-full bottom-[20%] left-[10%] opacity-40"></div>
<div class="absolute size-2 bg-primary rounded-full bottom-[35%] left-[25%] opacity-50"></div>
<div class="absolute size-2 bg-primary rounded-full bottom-[45%] left-[40%] opacity-60"></div>
<div class="absolute size-2 bg-primary rounded-full bottom-[65%] left-[60%] opacity-80"></div>
<div class="absolute size-2 bg-primary rounded-full bottom-[80%] left-[85%] opacity-100"></div>
<div class="absolute w-full h-[1px] bg-primary/30 top-1/2 -rotate-[15deg]"></div>
</div>
<div class="flex justify-between mt-1 text-[10px] text-slate-400">
<span>Low Sleep</span>
<span>High Sleep</span>
</div>
</div>
<div>
<p class="text-xs font-semibold mb-3 text-slate-500 uppercase tracking-wider">Energy Patterns by Hour</p>
<div class="flex items-end gap-1 h-12">
<div class="flex-1 bg-orange-200 h-[20%] rounded-t-sm"></div>
<div class="flex-1 bg-orange-300 h-[40%] rounded-t-sm"></div>
<div class="flex-1 bg-primary h-[90%] rounded-t-sm"></div>
<div class="flex-1 bg-primary h-[100%] rounded-t-sm"></div>
<div class="flex-1 bg-orange-400 h-[70%] rounded-t-sm"></div>
<div class="flex-1 bg-orange-300 h-[50%] rounded-t-sm"></div>
<div class="flex-1 bg-primary h-[85%] rounded-t-sm"></div>
<div class="flex-1 bg-orange-200 h-[30%] rounded-t-sm"></div>
</div>
</div>
</div>
</section>
<!-- Section 3: Habit Completion & Urge Trends -->
<section class="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<h3 class="text-lg font-bold mb-6 flex items-center gap-2">
<span class="material-symbols-outlined text-primary">task_alt</span> Habit &amp; Urge Tracking
                    </h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<div>
<p class="text-xs font-bold text-slate-500 mb-4 uppercase">Daily Completion Rate</p>
<div class="space-y-4">
<div class="flex items-center gap-4">
<span class="text-sm w-24 truncate">Meditation</span>
<div class="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div class="h-full bg-green-500 w-[95%]"></div>
</div>
<span class="text-xs font-bold w-10">95%</span>
</div>
<div class="flex items-center gap-4">
<span class="text-sm w-24 truncate">Read 20pgs</span>
<div class="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div class="h-full bg-green-500 w-[82%]"></div>
</div>
<span class="text-xs font-bold w-10">82%</span>
</div>
<div class="flex items-center gap-4">
<span class="text-sm w-24 truncate">Gym Session</span>
<div class="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div class="h-full bg-green-500 w-[60%]"></div>
</div>
<span class="text-xs font-bold w-10">60%</span>
</div>
</div>
</div>
<div>
<p class="text-xs font-bold text-slate-500 mb-4 uppercase">Resisted Urges (Negative Habits)</p>
<div class="h-32 flex items-end gap-2 px-2 border-b border-l border-slate-100 dark:border-slate-800">
<div class="flex-1 bg-red-400/20 h-4 rounded-t-sm"></div>
<div class="flex-1 bg-red-400/30 h-8 rounded-t-sm"></div>
<div class="flex-1 bg-red-400/50 h-12 rounded-t-sm"></div>
<div class="flex-1 bg-red-400/70 h-16 rounded-t-sm"></div>
<div class="flex-1 bg-red-500 h-24 rounded-t-sm"></div>
<div class="flex-1 bg-red-500 h-28 rounded-t-sm"></div>
<div class="flex-1 bg-red-500 h-20 rounded-t-sm"></div>
</div>
<div class="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase">
<span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
</div>
</div>
</div>
</section>
<!-- Section 5: Skill Building Progress -->
<section class="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<h3 class="text-lg font-bold mb-6 flex items-center gap-2">
<span class="material-symbols-outlined text-primary">military_tech</span> Skill Progression
                    </h3>
<div class="space-y-6">
<div class="flex flex-col gap-2">
<div class="flex justify-between text-sm">
<span class="font-semibold">UI/UX Design</span>
<span class="text-slate-500">124 / 200 hrs</span>
</div>
<div class="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div class="h-full bg-primary w-[62%]"></div>
</div>
<p class="text-[10px] text-slate-400 text-right">Intermediate • 76 hrs to 'Advanced'</p>
</div>
<div class="flex flex-col gap-2">
<div class="flex justify-between text-sm">
<span class="font-semibold">Public Speaking</span>
<span class="text-slate-500">45 / 100 hrs</span>
</div>
<div class="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div class="h-full bg-primary w-[45%]"></div>
</div>
<p class="text-[10px] text-slate-400 text-right">Beginner • 5 hrs to 'Conversational'</p>
</div>
<div class="flex flex-col gap-2">
<div class="flex justify-between text-sm">
<span class="font-semibold">Deep Meditation</span>
<span class="text-slate-500">88 / 150 hrs</span>
</div>
<div class="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
<div class="h-full bg-primary w-[58%]"></div>
</div>
<p class="text-[10px] text-slate-400 text-right">Expert • Next milestone: 'Zen Master'</p>
</div>
</div>
<button class="mt-8 w-full border border-slate-200 dark:border-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">Add New Skill Path</button>
</section>
</div>
</main>
</div>
</body></html>