import { createClient } from '@supabase/supabase-js';

const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZ2hieWZzYW56YXZhaHp6Z3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1NzcyMzYsImV4cCI6MjAxODE1MzIzNn0.uq80jO7DHpFSoH2ThrGJot7wOEETU84WZyta-jl4jEs';
const supabaseUrl = 'https://wpghbyfsanzavahzzgvm.supabase.co';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class DatabaseClient {
  supabase = supabase;

  async getChildsOfArea(parent_id) {
    // Retrieve rows with a specific parent
    const { data: specificParentData, error: specificParentError } =
      await supabase.from('areas').select('*').eq('parent_id', parent_id);
    console.log(specificParentData);
  }

  async getAreasWithNoParent() {
    // Retrieve rows with no parent (root nodes)
    const { data: rootNodesData, error: rootNodesError } = await supabase
      .from('areas')
      .select('*')
      .is('parent_id', null);
    console.log(rootNodesData);
  }

  async getAreasAndEvents(event_id) {
    let { data, error } = await supabase
      .from('events_areas_rel')
      .select(
        `
        area: area_id (
          *,
          sub_areas: areas (
            *,
            event_ids: events_areas_rel (
              id: event_id
            )
        )
      )
    `
      )
      .eq('event_id', event_id)
      .is('area.parent_id', null);
    // .innerJoin('areas', 'areas_events_rel.area_id', 'areas.id')
    // .innerJoin('events', 'areas_events_rel.event_id', 'events.id');

    if (data) {
      data = data
        .filter((elem) => elem && elem.area)
        .map((elem) => {
          elem.area.sub_areas = elem.area.sub_areas.filter((sub_area) =>
            sub_area.event_ids.find((event) => event.id === event_id)
          );
          return elem;
        });
    }
    console.log(data);
  }
}

export const databaseClient = new DatabaseClient();

try {
  const areaWithChilds = await databaseClient.getChildsOfArea(6);
  const areasWithNoParent = await databaseClient.getAreasWithNoParent();
  const areasWithHierarchy = await databaseClient.getHierarchyOfAreas();
} catch (e) {
  // Deal with the fact the chain failed
}

console.log('');
