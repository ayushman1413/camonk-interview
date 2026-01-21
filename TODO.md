# Debug and Fix Task

## Issues Identified:
1. **Next.js components in Vite React app**: `BlogDetail.tsx` uses `next/image`, `Header.tsx` uses `useRouter` and `useSearchParams`
2. **`next-themes` dependency**: Not compatible with Vite React
3. **Next.js in package.json**: Has `next: "16.1.4"` which shouldn't be there
4. **Duplicate CSS files**: Both `src/index.css` and `styles/globals.css`
5. **Duplicate component folders**: Both `components/` and `src/components/`

## Fix Plan:
- [ ] Fix BlogDetail.tsx - Replace next/image with standard img tag
- [ ] Fix Header.tsx - Replace Next.js router with React state
- [ ] Create simple theme-provider.tsx - Replace next-themes with React context
- [ ] Fix package.json - Remove next from dependencies
- [ ] Update App.tsx - Remove ThemeProvider wrapper
- [ ] Clean up styles/globals.css (consolidate to src/index.css)
- [ ] Test the application

