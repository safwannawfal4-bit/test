#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UI/UX Pro Max Search - BM25 search engine for UI/UX style guides

Usage:
  python search.py "<query>" [--domain <domain>] [--stack <stack>] [--max-results 3]
  python search.py "<query>" --design-system [-p "Project Name"]
  python search.py "<query>" --design-system --persist [-p "Project Name"] [--page "dashboard"] [-o ".codex/design-system"]
"""

import argparse
import io
import json
import sys
from pathlib import Path

from core import AVAILABLE_STACKS, CSV_CONFIG, MAX_RESULTS, search, search_stack
from design_system import generate_design_system


# Force UTF-8 for stdout/stderr to handle rich terminal output consistently.
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
if sys.stderr.encoding and sys.stderr.encoding.lower() != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


def format_output(result):
    """Format results for terminal use."""
    if 'error' in result:
        return f"Error: {result['error']}"

    output = []
    if result.get('stack'):
        output.append('## UI Pro Max Stack Guidelines')
        output.append(f"**Stack:** {result['stack']} | **Query:** {result['query']}")
    else:
        output.append('## UI Pro Max Search Results')
        output.append(f"**Domain:** {result['domain']} | **Query:** {result['query']}")
    output.append(f"**Source:** {result['file']} | **Found:** {result['count']} results\n")

    for index, row in enumerate(result['results'], 1):
        output.append(f'### Result {index}')
        for key, value in row.items():
            value_str = str(value)
            if len(value_str) > 300:
                value_str = value_str[:300] + '...'
            output.append(f'- **{key}:** {value_str}')
        output.append('')

    return '\n'.join(output)


def resolve_design_system_root(output_dir):
    """Resolve the actual design-system root for persistence and messaging."""
    base_dir = Path(output_dir) if output_dir else Path.cwd()
    return base_dir if base_dir.name == 'design-system' else base_dir / 'design-system'


def print_persisted_paths(project_name, page, output_dir):
    """Print persisted design-system paths using the real target directory."""
    project_slug = project_name.lower().replace(' ', '-') if project_name else 'default'
    persisted_dir = resolve_design_system_root(output_dir) / project_slug
    master_file = persisted_dir / 'MASTER.md'

    print('\n' + '=' * 60)
    print(f'Persisted design system: {persisted_dir}')
    print(f'  MASTER: {master_file}')
    if page:
        page_filename = page.lower().replace(' ', '-')
        print(f"  PAGE:   {persisted_dir / 'pages' / f'{page_filename}.md'}")
    print('')
    print(f"Usage: check {persisted_dir / 'pages'} /[page].md first when building a page.")
    print('If a page override exists, it overrides MASTER.md. Otherwise use MASTER.md.')
    print('=' * 60)


def main():
    parser = argparse.ArgumentParser(description='UI Pro Max Search')
    parser.add_argument('query', help='Search query')
    parser.add_argument('--domain', '-d', choices=list(CSV_CONFIG.keys()), help='Search domain')
    parser.add_argument(
        '--stack',
        '-s',
        choices=AVAILABLE_STACKS,
        help='Stack-specific search (html-tailwind, react, nextjs, etc.)',
    )
    parser.add_argument('--max-results', '-n', type=int, default=MAX_RESULTS, help='Max results (default: 3)')
    parser.add_argument('--json', action='store_true', help='Output as JSON')
    parser.add_argument('--design-system', '-ds', action='store_true', help='Generate a complete design system recommendation')
    parser.add_argument('--project-name', '-p', type=str, default=None, help='Project name for design system output')
    parser.add_argument('--format', '-f', choices=['ascii', 'markdown'], default='ascii', help='Output format for design system')
    parser.add_argument('--persist', action='store_true', help='Persist the design system under <output-dir>/design-system/<project>/')
    parser.add_argument('--page', type=str, default=None, help='Create a page-specific override file under pages/')
    parser.add_argument('--output-dir', '-o', type=str, default=None, help='Base output directory for persisted files (default: current directory)')

    args = parser.parse_args()

    if args.design_system:
        result = generate_design_system(
            args.query,
            args.project_name,
            args.format,
            persist=args.persist,
            page=args.page,
            output_dir=args.output_dir,
        )
        print(result)
        if args.persist:
            print_persisted_paths(args.project_name, args.page, args.output_dir)
        return

    if args.stack:
        result = search_stack(args.query, args.stack, args.max_results)
    else:
        result = search(args.query, args.domain, args.max_results)

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(format_output(result))


if __name__ == '__main__':
    main()
