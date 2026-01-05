/**
 * Supabase Client for Frontend
 * Browser-safe client using anon key
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch trending story clusters
 */
export async function getTrendingStories(limit: number = 10) {
  const { data, error } = await supabase
    .from('story_clusters')
    .select(`
      id,
      title,
      description,
      is_trending,
      last_updated_at,
      bias_coverage_map,
      left_article:articles!story_clusters_left_article_id_fkey(
        id, title, snippet, url, polarization_score,
        source:sources(name, logo_url, economic_score, social_score, institutional_score)
      ),
      center_article:articles!story_clusters_center_article_id_fkey(
        id, title, snippet, url, polarization_score,
        source:sources(name, logo_url, economic_score, social_score, institutional_score)
      ),
      right_article:articles!story_clusters_right_article_id_fkey(
        id, title, snippet, url, polarization_score,
        source:sources(name, logo_url, economic_score, social_score, institutional_score)
      )
    `)
    .eq('is_trending', true)
    .order('last_updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching trending stories:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single story cluster by ID
 */
export async function getStoryCluster(clusterId: string) {
  const { data, error } = await supabase
    .from('story_clusters')
    .select(`
      *,
      left_article:articles!story_clusters_left_article_id_fkey(*,
        source:sources(*)
      ),
      center_article:articles!story_clusters_center_article_id_fkey(*,
        source:sources(*)
      ),
      right_article:articles!story_clusters_right_article_id_fkey(*,
        source:sources(*)
      )
    `)
    .eq('id', clusterId)
    .single();

  if (error) {
    console.error('Error fetching story cluster:', error);
    return null;
  }

  return data;
}

/**
 * Fetch all sources for Source Map
 */
export async function getAllSources() {
  const { data, error} = await supabase
    .from('sources')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching sources:', error);
    return [];
  }

  return data || [];
}
