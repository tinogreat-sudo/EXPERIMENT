<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Habit Tracker | Personal OS</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
<style>
        body { font-family: 'Public Sans', sans-serif; }
        .material-symbols-outlined { font-size: 24px; vertical-align: middle; }
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
<div class="relative flex min-h-screen w-full flex-col overflow-x-hidden">
<div class="layout-container flex h-full grow flex-col">
<!-- Top Navigation -->
<header class="flex items-center justify-between border-b border-primary/10 bg-background-light dark:bg-background-dark px-6 py-4 sticky top-0 z-50">
<div class="flex items-center gap-4">
<div class="flex items-center justify-center size-10 rounded-xl bg-primary text-white">
<span class="material-symbols-outlined">star</span>
</div>
<div>
<h2 class="text-lg font-bold leading-tight tracking-tight">Personal OS</h2>
<p class="text-xs text-primary font-medium uppercase tracking-wider">Habit Tracker</p>
</div>
</div>
<div class="flex items-center gap-4">
<button class="flex items-center justify-center rounded-xl size-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
<span class="material-symbols-outlined">calendar_month</span>
</button>
<button class="flex items-center justify-center rounded-xl size-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
<span class="material-symbols-outlined">insights</span>
</button>
<div class="size-10 rounded-full border-2 border-primary/20 p-0.5">
<div class="size-full rounded-full bg-cover bg-center" data-alt="User profile avatar portrait" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBu8wVGMQMoP960Hj9Nko9XaN8pl1FUgRgE2ng1yy5l4PzrNd4-XMSLoCxY8j_zDxV5RBlHC1wnyUzkplY1VTAPPsgXNmMewG0iTfBdt7vtEHvlMmBc192xbpVo-HXpN7yAQXUNeqblpqYF5hYL67H2D6MyvQeUMxsstiECnlj9oTjUfU2HWnv8B1-3DYdl7C45c9kdg3MoEo_4Vb8b48IG_zg8Brnc_FvDh3YMjeohj3gm8yrIrOe60sDuxLXtndIWn-rAgdqgecrs')"></div>
</div>
</div>
</header>
<main class="flex-1 max-w-6xl mx-auto w-full p-6 space-y-8">
<!-- Overview Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<div class="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-primary/5 shadow-sm">
<p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Daily Completion</p>
<div class="flex items-end justify-between mt-2">
<h3 class="text-3xl font-bold">85%</h3>
<span class="text-green-600 text-sm font-bold flex items-center gap-1">
<span class="material-symbols-outlined text-sm">trending_up</span> +12%
                            </span>
</div>
<div class="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-4">
<div class="bg-primary h-2 rounded-full" style="width: 85%"></div>
</div>
</div>
<div class="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-primary/5 shadow-sm">
<p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Longest Streak</p>
<div class="flex items-end justify-between mt-2">
<h3 class="text-3xl font-bold">14 Days</h3>
<span class="material-symbols-outlined text-primary">local_fire_department</span>
</div>
<p class="text-xs text-slate-400 mt-4">Keep it up! Personal best is 21 days.</p>
</div>
<div class="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-primary/5 shadow-sm">
<p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Urges Resisted</p>
<div class="flex items-end justify-between mt-2">
<h3 class="text-3xl font-bold">28</h3>
<span class="text-primary text-sm font-bold">This Month</span>
</div>
<div class="flex gap-1 mt-4">
<div class="h-6 flex-1 bg-primary/10 rounded-sm"></div>
<div class="h-8 flex-1 bg-primary/20 rounded-sm"></div>
<div class="h-4 flex-1 bg-primary/10 rounded-sm"></div>
<div class="h-10 flex-1 bg-primary/40 rounded-sm"></div>
<div class="h-6 flex-1 bg-primary/60 rounded-sm"></div>
<div class="h-12 flex-1 bg-primary rounded-sm"></div>
<div class="h-7 flex-1 bg-primary/30 rounded-sm"></div>
</div>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
<!-- Positive Habits Section -->
<div class="lg:col-span-7 space-y-6">
<div class="flex items-center justify-between">
<h2 class="text-xl font-bold flex items-center gap-2">
<span class="material-symbols-outlined text-green-500">check_circle</span>
                                Positive Habits
                            </h2>
<button class="text-primary text-sm font-bold hover:underline">Add New</button>
</div>
<div class="space-y-3">
<!-- Habit Item -->
<div class="group flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all">
<div class="flex items-center gap-4">
<input checked="" class="size-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer" type="checkbox"/>
<div>
<h4 class="font-semibold leading-tight line-through opacity-50">Morning Meditation</h4>
<p class="text-xs text-slate-500">15 minutes • Streak: 8 days</p>
</div>
</div>
<div class="flex gap-1">
<div class="size-2 rounded-full bg-primary"></div>
<div class="size-2 rounded-full bg-primary"></div>
<div class="size-2 rounded-full bg-primary"></div>
<div class="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
</div>
</div>
<div class="group flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all">
<div class="flex items-center gap-4">
<input class="size-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer" type="checkbox"/>
<div>
<h4 class="font-semibold leading-tight">Hydration Goal</h4>
<p class="text-xs text-slate-500">2.5L daily • Streak: 3 days</p>
</div>
</div>
<div class="flex gap-1">
<div class="size-2 rounded-full bg-primary"></div>
<div class="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
<div class="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
<div class="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
</div>
</div>
<div class="group flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all">
<div class="flex items-center gap-4">
<input class="size-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer" type="checkbox"/>
<div>
<h4 class="font-semibold leading-tight">Reading</h4>
<p class="text-xs text-slate-500">20 pages • Streak: 0 days</p>
</div>
</div>
<div class="flex gap-1">
<div class="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
<div class="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
<div class="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
<div class="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
</div>
</div>
</div>
<!-- Trigger Log -->
<div class="mt-8 space-y-4">
<h3 class="text-lg font-bold">Trigger Log</h3>
<div class="bg-primary/5 border border-primary/10 rounded-xl p-4">
<div class="flex items-start gap-4">
<span class="material-symbols-outlined text-primary mt-1">warning</span>
<div>
<p class="text-sm font-medium">Recent Trigger Identified</p>
<p class="text-xs text-slate-500 mt-1">"Late night scrolling" often leads to missing morning meditation. Recommendation: Set app limits at 10 PM.</p>
</div>
</div>
</div>
</div>
</div>
<!-- Negative Habits Section -->
<div class="lg:col-span-5 space-y-6">
<div class="flex items-center justify-between">
<h2 class="text-xl font-bold flex items-center gap-2">
<span class="material-symbols-outlined text-red-500">dangerous</span>
                                Urge Tracking
                            </h2>
<button class="text-primary text-sm font-bold hover:underline">Settings</button>
</div>
<div class="space-y-4">
<!-- Negative Habit Card -->
<div class="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 p-5 space-y-4">
<div class="flex justify-between items-start">
<div>
<h4 class="font-bold">Excessive Caffeine</h4>
<p class="text-xs text-slate-500">Limit: 1 cup before noon</p>
</div>
<span class="px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600 text-[10px] font-bold uppercase">High Urge</span>
</div>
<div class="grid grid-cols-3 gap-2">
<button class="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
<span class="material-symbols-outlined text-red-500 text-xl">error</span>
<span class="text-[10px] font-bold mt-1 uppercase">Relapsed</span>
</button>
<button class="flex flex-col items-center justify-center p-2 rounded-lg border border-primary/40 bg-primary/10 text-primary">
<span class="material-symbols-outlined text-xl">shield</span>
<span class="text-[10px] font-bold mt-1 uppercase text-center">Resisted</span>
</button>
<button class="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
<span class="material-symbols-outlined text-slate-400 text-xl">sentiment_satisfied</span>
<span class="text-[10px] font-bold mt-1 uppercase">No Urge</span>
</button>
</div>
</div>
<div class="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 p-5 space-y-4">
<div class="flex justify-between items-start">
<div>
<h4 class="font-bold">Social Media Junk</h4>
<p class="text-xs text-slate-500">Goal: &lt; 30m daily</p>
</div>
<span class="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-600 text-[10px] font-bold uppercase">Safe</span>
</div>
<div class="grid grid-cols-3 gap-2">
<button class="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
<span class="material-symbols-outlined text-slate-400 text-xl">error</span>
<span class="text-[10px] font-bold mt-1 uppercase">Relapsed</span>
</button>
<button class="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
<span class="material-symbols-outlined text-slate-400 text-xl">shield</span>
<span class="text-[10px] font-bold mt-1 uppercase text-center">Resisted</span>
</button>
<button class="flex flex-col items-center justify-center p-2 rounded-lg border border-primary/40 bg-primary/10 text-primary">
<span class="material-symbols-outlined text-xl">sentiment_satisfied</span>
<span class="text-[10px] font-bold mt-1 uppercase">No Urge</span>
</button>
</div>
</div>
</div>
<!-- Mini Chart for Urge Trends -->
<div class="p-5 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
<h4 class="text-sm font-bold mb-4">Urge Frequency Trend</h4>
<div class="h-32 flex items-end justify-between gap-2 px-2">
<div class="w-full bg-primary/20 rounded-t-sm" style="height: 40%"></div>
<div class="w-full bg-primary/20 rounded-t-sm" style="height: 60%"></div>
<div class="w-full bg-primary/20 rounded-t-sm" style="height: 30%"></div>
<div class="w-full bg-primary/60 rounded-t-sm" style="height: 80%"></div>
<div class="w-full bg-primary rounded-t-sm" style="height: 95%"></div>
<div class="w-full bg-primary/40 rounded-t-sm" style="height: 50%"></div>
<div class="w-full bg-primary/20 rounded-t-sm" style="height: 20%"></div>
</div>
<div class="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
<span>Mon</span>
<span>Tue</span>
<span>Wed</span>
<span>Thu</span>
<span>Fri</span>
<span>Sat</span>
<span>Sun</span>
</div>
</div>
</div>
</div>
</main>
<!-- Bottom Quick Actions -->
<footer class="p-6 bg-background-light dark:bg-background-dark border-t border-primary/10">
<div class="max-w-6xl mx-auto flex flex-wrap gap-4 items-center justify-between">
<div class="flex gap-4">
<button class="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20">
<span class="material-symbols-outlined text-sm">add</span>
                            Log New Habit
                        </button>
<button class="px-4 py-2 bg-primary/10 text-primary rounded-lg font-bold text-sm flex items-center gap-2">
<span class="material-symbols-outlined text-sm">share</span>
                            Export Data
                        </button>
</div>
<p class="text-xs text-slate-500 italic">"First we make our habits, then our habits make us." - John Dryden</p>
</div>
</footer>
</div>
</div>
</body></html>