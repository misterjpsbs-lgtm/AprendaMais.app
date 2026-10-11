<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Store data (courses, categories, events) is read client-side via react-query from Lovable Cloud; RLS restricts writes to `has_role(admin)`. Why: simple, secure without server functions.
- First signed-up user becomes admin via DB trigger; roles live in `user_roles`. Why: no hardcoded credentials.
- Course images are https URLs (public storage buckets are blocked in this workspace).
