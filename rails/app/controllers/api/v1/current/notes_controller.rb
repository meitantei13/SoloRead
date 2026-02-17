class Api::V1::Current::NotesController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    notes = current_user.notes.includes(:tags, :book)

    if params[:q].present?
      notes = notes.where("content LIKE ?", "%#{params[:q]}%")
    end

    if params[:tag_id].present?
      notes = notes.joins(:note_tags).where(note_tags: { tag_id: params[:tag_id] })
    end

    if params[:book_id].present?
      notes = notes.where(book_id: params[:book_id])
    end

    notes = notes.order(created_at: :desc).page(params[:page] || 1).per(10)
    render json: notes, meta: pagination(notes), adapter: :json
  end

  def show
    note = current_user.notes.find(params[:id])
    render json: note
  end

  def create
    note = current_user.notes.create!(note_params)
    render json: note
  end

  def update
    note = current_user.notes.find(params[:id])
    note.update!(note_params)
    render json: note
  end

  def destroy
    note = current_user.notes.find(params[:id])
    note.destroy!
    head :no_content
  end

  private

    def note_params
      params.expect(note: [:content, :book_id, tag_ids: []])
    end
end
