import { supabase } from '../lib/supabase'

// Portfolios
export async function fetchPortfolios(userId) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .order('created_at')
  if (error) { console.error('fetchPortfolios:', error); return [] }
  return data
}

export async function createPortfolio(userId, name = 'Default', balance = 100000) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('portfolios')
    .insert({ user_id: userId, name, balance })
    .select()
    .single()
  if (error) { console.error('createPortfolio:', error); return null }
  return data
}

export async function updatePortfolioBalance(portfolioId, balance) {
  if (!supabase) return
  const { error } = await supabase
    .from('portfolios')
    .update({ balance })
    .eq('id', portfolioId)
  if (error) console.error('updatePortfolioBalance:', error)
}

// Positions
export async function fetchPositions(userId) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) { console.error('fetchPositions:', error); return [] }
  return data
}

export async function savePosition(userId, portfolioId, position) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('positions')
    .insert({
      user_id: userId,
      portfolio_id: portfolioId,
      asset: position.asset,
      symbol: position.symbol,
      type: position.type,
      quantity: position.quantity,
      entry_price: position.entry_price,
      total: position.total,
      notes: position.notes || null,
    })
    .select()
    .single()
  if (error) { console.error('savePosition:', error); return null }
  return data
}

export async function removePosition(positionId) {
  if (!supabase) return
  const { error } = await supabase
    .from('positions')
    .delete()
    .eq('id', positionId)
  if (error) console.error('removePosition:', error)
}

// Watchlists
export async function fetchWatchlists(userId) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('watchlists')
    .select('*')
    .eq('user_id', userId)
  if (error) { console.error('fetchWatchlists:', error); return [] }
  return data
}

export async function saveWatchlist(userId, name, symbols) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('watchlists')
    .upsert({ user_id: userId, name, symbols }, { onConflict: 'user_id,name' })
    .select()
    .single()
  if (error) { console.error('saveWatchlist:', error); return null }
  return data
}

// Preferences
export async function fetchPreferences(userId) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('preferences')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') { console.error('fetchPreferences:', error); return null }
  return data
}

export async function savePreferences(userId, prefs) {
  if (!supabase) return
  const { error } = await supabase
    .from('preferences')
    .upsert({ user_id: userId, ...prefs })
  if (error) console.error('savePreferences:', error)
}

// Profile
export async function fetchProfile(userId) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) { console.error('fetchProfile:', error); return null }
  return data
}

export async function updateProfile(userId, updates) {
  if (!supabase) return
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  if (error) console.error('updateProfile:', error)
}

// Achievements
export async function fetchAchievements(userId) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
  if (error) { console.error('fetchAchievements:', error); return [] }
  return data
}

export async function unlockAchievement(userId, achievementId) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('achievements')
    .upsert({ user_id: userId, achievement_id: achievementId }, { onConflict: 'user_id,achievement_id' })
    .select()
    .single()
  if (error) { console.error('unlockAchievement:', error); return null }
  return data
}
