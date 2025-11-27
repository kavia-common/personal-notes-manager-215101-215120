import { v4 as uuidv4 } from 'uuid';

/**
 * PUBLIC_INTERFACE
 * getNotesService decides at runtime whether to use Supabase or LocalStorage storage.
 * Returns an object implementing: list(), get(id), create(note), update(id, patch), remove(id)
 */
export function getNotesService() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  if (url && key) {
    try {
      // Lazy require so that build does not need @supabase/supabase-js installed
      // eslint-disable-next-line global-require
      const supabaseLib = require('@supabase/supabase-js');
      const createClient = supabaseLib.createClient || supabaseLib.default?.createClient;
      if (typeof createClient === 'function') {
        const client = createClient(url, key, {
          auth: { persistSession: false }
        });
        return new SupabaseNotesService(client);
      }
      console.warn('Supabase library found but createClient not available, using LocalStorage.');
    } catch (e) {
      console.warn('Supabase not available or failed to initialize, falling back to LocalStorage.', e);
    }
  }
  return new LocalStorageNotesService();
}

const STORAGE_KEY = 'pnm.notes.v1';

class LocalStorageNotesService {
  /**
   * PUBLIC_INTERFACE
   * list returns all notes sorted by updated_at desc
   */
  async list() {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return items.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  /**
   * PUBLIC_INTERFACE
   * get returns a note by id or null
   */
  async get(id) {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return items.find(n => n.id === id) || null;
  }

  /**
   * PUBLIC_INTERFACE
   * create adds a new note
   */
  async create({ title, content }) {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const now = new Date().toISOString();
    const note = { id: uuidv4(), title: title || 'Untitled', content: content || '', updated_at: now };
    items.push(note);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return note;
  }

  /**
   * PUBLIC_INTERFACE
   * update patches a note
   */
  async update(id, patch) {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const idx = items.findIndex(n => n.id === id);
    if (idx === -1) throw new Error('Note not found');
    items[idx] = { ...items[idx], ...patch, updated_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items[idx];
  }

  /**
   * PUBLIC_INTERFACE
   * remove deletes a note
   */
  async remove(id) {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = items.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { id };
  }
}

class SupabaseNotesService {
  constructor(client) {
    this.client = client;
    this.table = 'notes';
  }

  /**
   * PUBLIC_INTERFACE
   * list returns all notes sorted desc
   */
  async list() {
    const { data, error } = await this.client.from(this.table)
      .select('id,title,content,updated_at')
      .order('updated_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  /**
   * PUBLIC_INTERFACE
   * get returns single note
   */
  async get(id) {
    const { data, error } = await this.client.from(this.table)
      .select('id,title,content,updated_at')
      .eq('id', id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  }

  /**
   * PUBLIC_INTERFACE
   * create a new note
   */
  async create({ title, content }) {
    const now = new Date().toISOString();
    const note = { id: uuidv4(), title: title || 'Untitled', content: content || '', updated_at: now };
    const { data, error } = await this.client.from(this.table).insert(note).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * PUBLIC_INTERFACE
   * update patches a note
   */
  async update(id, patch) {
    const { data, error } = await this.client.from(this.table)
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * PUBLIC_INTERFACE
   * remove deletes note
   */
  async remove(id) {
    const { error } = await this.client.from(this.table).delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { id };
  }
}
